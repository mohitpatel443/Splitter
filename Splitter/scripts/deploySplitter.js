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

    ContractFactory = await ethers.getContractFactory("Splitter");
    Contract = await ContractFactory.deploy(

        "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        "0x13e9E95f28884f548a321adE2660a07C877c5201"
    );
    await Contract.deployed();
    console.log("Contract deployed to:", Contract.address);

        sleep(50000);

        if (network.name == "bscTestnet" || network.name == "goerli") {
            await hre.run("verify:verify", {
                address: Contract.address,
                constructorArguments: [
                    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
                    "0x13e9E95f28884f548a321adE2660a07C877c5201"
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
