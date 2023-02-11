const fs = require('fs')

const dpack   = require('@etherpacks/dpack')
const factory = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json')
const pool    = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json')
const router  = require('@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json')

const factory_address = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
const router_address  = '0xE592427A0AEce92De3Edee1F18E0157C05861564'

async function build(network) {
  const builder = new dpack.PackBuilder(network)
  const json = JSON.stringify

  const Factory_artifact = {
    abi: factory.abi,
    bytecode: factory.bytecode
  }
  const Pool_artifact = {
    abi: pool.abi,
    bytecode: pool.bytecode
  }
  const Router_artifact = {
    abi: router.abi,
    bytecode: router.bytecode
  }

  fs.writeFileSync(`./link/UniswapV3Factory.json`, json(Factory_artifact))
  fs.writeFileSync(`./link/UniswapV3Pool.json`, json(Pool_artifact))
  fs.writeFileSync(`./link/SwapRouter.json`, json(Router_artifact))

  await builder.packObject({
    objectname: 'swapRouter',
    address: router_address,
    typename: 'SwapRouter',
    artifact: Router_artifact
  })
  await builder.packObject({
    objectname: 'uniswapV3Factory',
    address: factory_address,
    typename: 'UniswapV3Factory',
    artifact: Factory_artifact
  })
  await builder.packType({
    typename: 'UniswapV3Pool',
    artifact: Pool_artifact
  })

  const pack = await builder.build();
  fs.writeFileSync(`./pack/uniswapv3_${network}.dpack.json`, JSON.stringify(pack, null, 2));
}

build('ethereum')
build('arbitrum')
build('optimism')
build('goerli')
