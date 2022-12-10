pragma solidity >=0.4.21 <0.9.0;

contract BlockCore {

  string fileID;
  string ipfsHash;
  address owner = msg.sender;

  struct File{
        string fileID;
        string ipfsHash;
        address owner;
    }

    File []files;

    event fileUploaded(
        string fileID,
        string ipfsHash,
        address owner
    );

    function addFile(string memory _fileID, string memory _ipfsHash) public {
        owner = msg.sender;
        File memory f = File(_fileID, _ipfsHash, owner);
        files.push(f);
        emit fileUploaded(_fileID, _ipfsHash, owner);
    }

    function getFile(string memory _fileID) public view returns(string memory){
        
            for(uint i; i < files.length; i++){
                if(msg.sender == files[i].owner){
                    if(compareStrings(files[i].fileID, _fileID)){
                        string memory result = files[i].ipfsHash;
                        return result;
                    }
                }
            }
            return "No Matching FileID For this Account OR Mismatching Address";
        
    }

    function compareStrings(string memory a, string memory b) private view returns (bool) {
    return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
}
}
