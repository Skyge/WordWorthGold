pragma solidity 0.5.0;
pragma experimental ABIEncoderV2;

contract ValueSystem {
    enum Stages{
        Draft, 
        Active, 
        BlackList, 
        WhiteList
    }

    uint8 constant RewardRate = 3;
    uint8 constant PunishmentRate = 5;
    uint8 constant QualifiedRate = 10; // judge by rejecting numbers
    uint8 constant UnqualifiedRate = 50; // judge by vouching numbers
    uint8 constant UserDaliyVoteLimited = 10;
    uint8 constant TenPer = 100;
    uint8 constant Percent = 10;
    uint16 constant Decimal = 1000;
    uint64 constant VoteInterval = 1 days;
    bytes32[] public BlackList;
    bytes32[] public WhiteList;
    bytes32[] public restaurantList;
    address private owner_;

    struct Restaurant {
        uint256 vouchNumber;
        uint256 rejectNumber;
        uint256 createTime;
        Stages  stage;
        address[] vouchers;
        address[] rejecters;
    }

    struct User {
        bytes32 userName;
        uint256 totalVouch;
        uint256 totalReject;
        uint256 currentScore;
        uint256 votingCount;
        uint256 lastVotedTime;
        bool    hasRegistered;
    }

    mapping(bytes32 => Restaurant) public restaurants;
    mapping(bytes32 => mapping(address => uint256)) public vouchIndexes;
    mapping(bytes32 => mapping(address => uint256)) public rejectIndexes;
    mapping(address => User) public users;
    mapping(address => bytes32[]) public voteFor;
    mapping(address => bytes32[]) public dailyVoting;
    mapping(bytes32 => address) public managers;

    event VoteSuccess(address indexed voter, bytes32 indexed restaurantName, bool vouch);
    event NewRestaurant(bytes32 indexed name, address indexed owner);

    modifier onlyPartA(bytes32 _name) {
        require(msg.sender == managers[_name]);
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner_);
        _;
    }

    constructor() public {
        owner_ = msg.sender;
    }

    function owner() public view returns (address) {
        return owner_;
    }

    function addRestaurant(bytes32  _restaurantName, address _partA) public onlyOwner returns (bool) {
        require(restaurants[_restaurantName].stage == Stages.Draft);
        restaurants[_restaurantName].stage = Stages.Active;
        restaurants[_restaurantName].createTime = block.timestamp;
        managers[_restaurantName] = _partA;
        restaurantList.push(_restaurantName);
        return true;
    }

    function userRegister(bytes32 _userName) public returns (bool) {
        require(users[msg.sender].hasRegistered == false);
        users[msg.sender].userName = _userName;
        users[msg.sender].currentScore = 60*Decimal;
        users[msg.sender].lastVotedTime = block.timestamp;
        users[msg.sender].hasRegistered = true;
        return true;
    }

    function vouch(bytes32 _restaurantName) public returns (bool) {
        require(restaurants[_restaurantName].stage == Stages.Active);
        require(users[msg.sender].hasRegistered);
        if (block.timestamp >= users[msg.sender].lastVotedTime + VoteInterval) {
            users[msg.sender].votingCount = 0;
            users[msg.sender].lastVotedTime += VoteInterval;
            for (uint256 i = 0; i < dailyVoting[msg.sender].length; i++) {
                delete dailyVoting[msg.sender][i];
            }
        }
        for (uint256 i = 0; i < dailyVoting[msg.sender].length; i++) {
            require(dailyVoting[msg.sender][i] != _restaurantName);
        }
        require(users[msg.sender].votingCount < UserDaliyVoteLimited);

        users[msg.sender].totalVouch += 1;
        users[msg.sender].votingCount += 1;

        dailyVoting[msg.sender].push(_restaurantName);
        restaurants[_restaurantName].vouchNumber += 1;
        vouchIndexes[_restaurantName][msg.sender] = restaurants[_restaurantName].vouchNumber;
        restaurants[_restaurantName].vouchers.push(msg.sender);
        emit VoteSuccess(msg.sender, _restaurantName, true);

        return true;
    }

    function reject(bytes32 _restaurantName) public returns (bool) {
        require(restaurants[_restaurantName].stage == Stages.Active);
        require(users[msg.sender].hasRegistered);
        if (block.timestamp >= users[msg.sender].lastVotedTime + VoteInterval) {
            users[msg.sender].votingCount = 0;
            users[msg.sender].lastVotedTime += VoteInterval;
            for (uint256 i = 0; i < dailyVoting[msg.sender].length; i++) {
                delete dailyVoting[msg.sender][i];
            }
        }
        for (uint256 i = 0; i < dailyVoting[msg.sender].length; i++) {
            require(dailyVoting[msg.sender][i] != _restaurantName);
        }
        require(users[msg.sender].votingCount < UserDaliyVoteLimited);

        users[msg.sender].totalReject += 1;
        users[msg.sender].votingCount += 1;

        dailyVoting[msg.sender].push(_restaurantName);
        restaurants[_restaurantName].rejectNumber += 1;
        rejectIndexes[_restaurantName][msg.sender] = restaurants[_restaurantName].rejectNumber;
        restaurants[_restaurantName].rejecters.push(msg.sender);
        emit VoteSuccess(msg.sender, _restaurantName, false);

        return true;
    }

    function getResult(bytes32 _restaurantName) public onlyPartA(_restaurantName) returns (bool) {
        require(restaurants[_restaurantName].createTime + 7*VoteInterval >= block.timestamp);
        uint256 total = restaurants[_restaurantName].rejectNumber + restaurants[_restaurantName].vouchNumber;
        uint256 averageRejectScore = restaurants[_restaurantName].rejectNumber * 100 / total;
        uint256 averageVouchScore = restaurants[_restaurantName].vouchNumber * 100 / total;
        if (averageRejectScore <= QualifiedRate) {
            restaurants[_restaurantName].stage = Stages.WhiteList;
            require(calculateVouchingScores(_restaurantName, averageRejectScore));
            return true;
        } else if (averageVouchScore <= UnqualifiedRate) {
            restaurants[_restaurantName].stage = Stages.BlackList;
            require(calculateRejectingScores(_restaurantName, averageVouchScore));
            return true;
        }
        return false;
    }

    function calculateVouchingScores(bytes32 _restaurantName, uint256 _averageRejectScore) internal onlyPartA(_restaurantName) returns (bool) {
        for (uint256 i = 0; i < restaurants[_restaurantName].vouchers.length; i++) {
            if (i/10 == 0) {
                users[restaurants[_restaurantName].vouchers[i]].currentScore += 1*Decimal;
            } else if (i/10 <= 10) {
                users[restaurants[_restaurantName].vouchers[i]].currentScore += 1*TenPer;
            } else if (i/10 <= 100) {
                users[restaurants[_restaurantName].vouchers[i]].currentScore += 1*Percent;
            } else if (i/10 > 100) {
                users[restaurants[_restaurantName].vouchers[i]].currentScore += 1;
            }
        }

        for (uint256 i = 0; i < restaurants[_restaurantName].rejecters.length; i++) {
            users[restaurants[_restaurantName].rejecters[i]].currentScore -= _averageRejectScore*TenPer;
        }
        return true;
    }

    function calculateRejectingScores(bytes32 _restaurantName, uint256 _averageVouchScore) internal onlyPartA(_restaurantName) returns (bool) {
        for (uint256 i = 0; i < restaurants[_restaurantName].rejecters.length; i++) {
            if (i/10 == 0) {
                users[restaurants[_restaurantName].rejecters[i]].currentScore += 1*Decimal;
            } else if (i/10 <= 10) {
                users[restaurants[_restaurantName].rejecters[i]].currentScore += 1*TenPer;
            } else if (i/10 <= 100) {
                users[restaurants[_restaurantName].rejecters[i]].currentScore += 1*Percent;
            } else if (i/10 > 100) {
                users[restaurants[_restaurantName].rejecters[i]].currentScore += 1;
            }
        }

        for (uint256 i = 0; i < restaurants[_restaurantName].vouchers.length; i++) {
            users[restaurants[_restaurantName].vouchers[i]].currentScore -= _averageVouchScore;
        }
        return true;
    }

    function whiteListLength() public view returns(uint256) {
        return WhiteList.length;
    }

    function blackListLength() public view returns(uint256) {
        return BlackList.length;
    }

    function restaurantListLength() public view returns(uint256) {
        return restaurantList.length;
    }

    function getRestaurantByName(bytes32 name) public view returns (Restaurant memory) {
        return restaurants[name];
    }
}
