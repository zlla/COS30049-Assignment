pragma solidity 0.5.16;

import "./ERC721Full.sol";

contract Color is ERC721Full {
    string[] public colors;
    mapping(string => bool) _colorExists;

    constructor() ERC721Full("Color", "COLOR") public {
    }
   
    function mint(string memory _color) public {
      require(!_colorExists[_color]);
      uint _id = colors.push(_color);
      _mint(msg.sender, _id);
      _colorExists[_color] = true;
    }

    function burn(uint _tokenId) public {
      require(_isApprovedOrOwner(msg.sender, _tokenId));
      _burn(ownerOf(_tokenId), _tokenId); 
    }

}
