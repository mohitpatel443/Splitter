// SPDX-License-Identifier: MIT

const { expect } = require('chai');
const { waffle, ethers } = require('hardhat');
const { BN } = require('ethers');
const burnAddress = "0x000000000000000000000000000000000000dEaD";
const { inTransaction } = require('@openzeppelin/test-helpers/src/expectEvent')

describe('splitter Contract', () => {

    before(async () => {

        [owner, user1, user2, user3, user4, user5, user6, ...users] = await ethers.getSigners();
        // Getting signer of platform address
        platformOwner = new ethers.Wallet(process.env.privateKey, waffle.provider);

        UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
        Factory = await UniswapV2Factory.deploy(owner.address);
        await Factory.deployed();

        Sample = await(await ethers.getContractFactory('SampleERC20')).deploy();

        WETH9 = await ethers.getContractFactory("WETH9");
        WETH = await WETH9.deploy();
        await WETH.deployed();

        UniswapV2Router02 = await ethers.getContractFactory("UniswapV2Router02");
        Router = await UniswapV2Router02.deploy(Factory.address, WETH.address);
        await Router.deployed();

        BUSDContract = await ethers.getContractFactory("BUSD");
        BUSD = await BUSDContract.deploy();
        await BUSD.deployed();

        splittercontract = await ethers.getContractFactory("Splitter");
        Splitter = await splittercontract.deploy(Router.address, BUSD.address);
        await Splitter.deployed();

    });
    describe('Testing swap function', () => {

        it('Owner Adding Liquidity of token', async () => {
            await BUSD.approve(Router.address, ethers.utils.parseUnits("10000000"));
            await Sample.approve(Router.address, ethers.utils.parseUnits("10000000"));
            await Router.addLiquidity(
                BUSD.address, 
                Sample.address,
                ethers.utils.parseUnits("10000000"), 
                ethers.utils.parseUnits("10000000"), 
                0, 
                0, 
                owner.address, 
                99999999999
            );
        });

        it('Adding Liquidity of BUSD', async () => {
            await BUSD.approve(Router.address, ethers.utils.parseEther("20000000"));
            
            await Router.addLiquidityETH(
                BUSD.address, 
                ethers.utils.parseEther("10000000"), 
                0, 
                0, 
                owner.address, 
                99999999999,
                {
                    value: ethers.utils.parseEther("100")
                }
            );
        });

       it("Test Split if bool is true ",async()=>
       {

        await BUSD.approve(Splitter.address,  ethers.utils.parseEther("10000"));
        await Splitter.split(user1.address, ethers.utils.parseEther("25") ,Sample.address , true);
        expect(await BUSD.balanceOf(user1.address)).to.equal(ethers.utils.parseUnits("12"));
        expect(await BUSD.balanceOf(Splitter.address)).to.equal(ethers.utils.parseUnits("12"));
        console.log(await BUSD.balanceOf(Splitter.address));


       })   

       it("Test Split if bool is false ",async()=>
       {

        await BUSD.approve(Splitter.address,  ethers.utils.parseEther("10000"));
        console.log(await Sample.balanceOf(burnAddress));
        await Splitter.split(user1.address, ethers.utils.parseEther("25") ,Sample.address , false);
        expect(await Sample.balanceOf(Splitter.address)).to.equal(ethers.utils.parseUnits("0"))
        expect(await BUSD.balanceOf(user1.address)).to.equal(ethers.utils.parseUnits("24"));
        console.log(await Sample.balanceOf(burnAddress));
        console.log(await Sample.balanceOf(Splitter.address));

       })       
    });
});