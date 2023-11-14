const { ethers, upgrades } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  const WheelOfFortune = await ethers.getContractFactory('WheelOfFortune');
  const wheelOfFortune = await upgrades.deployProxy(WheelOfFortune, [1000000, 1000000], { initializer: 'initialize' });

  await wheelOfFortune.deployed();

  console.log('WheelOfFortune deployed to:', wheelOfFortune.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
