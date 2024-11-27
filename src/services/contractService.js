import { ethers } from 'ethers';
import JTokenABI from '../contracts/abi_definitions/JTokenABI.json';
import contractAddressData from '../contracts/abi_definitions/contractAddress.json';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const JTokenContract = new ethers.Contract(contractAddressData.address, JTokenABI, signer);

export default JTokenContract;
