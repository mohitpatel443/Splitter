const hre = require("hardhat");

let Contract;

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

async function main() {

    ContractFactory = await ethers.getContractFactory("SampleERC20");
    Contract = await ContractFactory.deploy(

    );
    await Contract.deployed();
    console.log("Contract deployed to:", Contract.address);

    sleep(50000);

    if (network.name == "bscTestnet" || network.name == "rinkeby") {
        await hre.run("verify:verify", {
            address: Contract.address,
            contract: "contracts/test/SampleERC20.sol:SampleERC20",
            constructorArguments: [

            ],
        })
    }
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
