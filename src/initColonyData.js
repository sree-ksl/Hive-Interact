// Import the prerequisites

const { providers, Wallet } = require('ethers');
const { default: EthersAdapter } = require('@colony/colony-js-adapter-ethers');
const { TrufflepigLoader } = require('@colony/colony-js-contract-loader-http');

var fs = require('fs');
var Constants = require('./app/generated_constants.js')

// Import the ColonyNetworkClient
const { default: ColonyNetworkClient } = require('@colony/colony-js-client');

// Create an instance of the Trufflepig contract loader
const loader = new TrufflepigLoader();

// create a provider for local TestRPC (Ganache)
const provider = new providers.JsonRpcProvider('http://localhost:8545/');

const createColony = async () => {
  // get the private key from the first account from the ganache-accounts
  const { privateKey } = await loader.getAccount(0);

  // create a wallet with the private key
  const wallet = new Wallet(privateKey, provider);

  // create an adapter (powered by ethers)
  const adapter = new EthersAdapter({
    loader,
    provider,
    wallet,
  });


  // Connect to ColonyNetwork with the adapter!
  const networkClient = new ColonyNetworkClient({ adapter });
  await networkClient.init();

  console.log('Connected to Colony Network Client.')

  //////////////////////////////////////////////////////////////////
  // Deploy the ERC20 token for all Colonies
  //////////////////////////////////////////////////////////////////
  const tokenAddress = await networkClient.createToken({
    name: 'Hive Interact',
    symbol: 'Hive',
  });
  console.log('Token address: ' + tokenAddress);

  //////////////////////////////////////////////////////////////////
  // Create the Colonies - algorithms, data-structures, misc
  //////////////////////////////////////////////////////////////////
  let algoData = await networkClient.createColony.send({ tokenAddress });
  console.log('Created Hive Colony.')
  let dsData = await networkClient.createColony.send({ tokenAddress });
  console.log('Created DS Colony.')
  let miscData = await networkClient.createColony.send({ tokenAddress });
  console.log('Created Miscellaneous Colony.')

  // update the colony ids in app constants
  Constants.colonyNameToIdMapping['hive'] = algoData.eventData.colonyId
  Constants.colonyNameToIdMapping['ds'] = dsData.eventData.colonyId
  Constants.colonyNameToIdMapping['misc'] = miscData.eventData.colonyId


  //////////////////////////////////////////////////////////////////
  // Initialize the Algorithm colony
  //////////////////////////////////////////////////////////////////
  const algoColonyClient = await networkClient.getColonyClient(algoData.eventData.colonyId)
  console.log('Connected to Hive Colony Client.')
  const algoSkillId = await algoColonyClient.getDomain.call({ domainId: 1 })

  // search, strings, sorting, greedy, dynamic 
  await algoColonyClient.addDomain.send({parentSkillId: algoSkillId.localSkillId})
  console.log('1/6...')
  await algoColonyClient.addDomain.send({parentSkillId: algoSkillId.localSkillId})
  console.log('2/6...')
  await algoColonyClient.addDomain.send({parentSkillId: algoSkillId.localSkillId})
  console.log('3/6...')
  await algoColonyClient.addDomain.send({parentSkillId: algoSkillId.localSkillId})
  console.log('4/6...')
  await algoColonyClient.addDomain.send({parentSkillId: algoSkillId.localSkillId})
  console.log('5/6...')
  await algoColonyClient.addDomain.send({parentSkillId: algoSkillId.localSkillId})
  console.log('6/6...')

  // use algoCount -0, -1, -2 etc respectively for above domains
  var count = await algoColonyClient.getDomainCount.call()
  let algoCount = count.count

  // update the ids in constants file
  Constants.domainNameToIdMapping['hive']['search'] = algoCount-5
  Constants.domainNameToIdMapping['hive']['strings'] = algoCount-4
  Constants.domainNameToIdMapping['hive']['sorting'] = algoCount-3
  Constants.domainNameToIdMapping['hive']['greedy'] = algoCount-2
  Constants.domainNameToIdMapping['hive']['dp'] = algoCount-1
  Constants.domainNameToIdMapping['hive']['misc'] = algoCount

  Constants.colonyToDomainMapping['hive'] = {}
  Constants.colonyToDomainMapping['hive'][algoCount-5] = { "name": "Search", "slug": "search" }
  Constants.colonyToDomainMapping['hive'][algoCount-4] = { "name": "Strings", "slug": "strings" }
  Constants.colonyToDomainMapping['hive'][algoCount-3] = { "name": "Sorting", "slug": "sorting" }
  Constants.colonyToDomainMapping['hive'][algoCount-2] = { "name": "Greedy", "slug": "greedy" }
  Constants.colonyToDomainMapping['hive'][algoCount-1] = { "name": "Dynamic", "slug": "dp" }
  Constants.colonyToDomainMapping['hive'][algoCount] = { "name": "Miscellaneous", "slug": "misc" }

  //////////////////////////////////////////////////////////////////
  // Initialize the Data Structures colony
  //////////////////////////////////////////////////////////////////
  const dsColonyClient = await networkClient.getColonyClient(dsData.eventData.colonyId)
  console.log('Connected to DS Colony Client.')
  const dsSkillId = await dsColonyClient.getDomain.call({ domainId: 1 })

  console.log('Creating Domains')
  // linked-lists, arrays, trees, stacks-queues, graphs
  await dsColonyClient.addDomain.send({parentSkillId: dsSkillId.localSkillId})
  console.log('1/6...')
  await dsColonyClient.addDomain.send({parentSkillId: dsSkillId.localSkillId})
  console.log('2/6...')
  await dsColonyClient.addDomain.send({parentSkillId: dsSkillId.localSkillId})
  console.log('3/6...')
  await dsColonyClient.addDomain.send({parentSkillId: dsSkillId.localSkillId})
  console.log('4/6...')
  await dsColonyClient.addDomain.send({parentSkillId: dsSkillId.localSkillId})
  console.log('5/6...')
  await dsColonyClient.addDomain.send({parentSkillId: dsSkillId.localSkillId})
  console.log('6/6...')

  // use dsCount -0, -1, -2 etc respectively for above domains
  count = await dsColonyClient.getDomainCount.call()
  let dsCount = count.count

  // update the ids in constants file
  Constants.domainNameToIdMapping['ds']['linked-lists'] = dsCount-5
  Constants.domainNameToIdMapping['ds']['arrays'] = dsCount-4
  Constants.domainNameToIdMapping['ds']['stacks-queues'] = dsCount-3
  Constants.domainNameToIdMapping['ds']['trees'] = dsCount-2
  Constants.domainNameToIdMapping['ds']['hash-maps'] = dsCount-1
  Constants.domainNameToIdMapping['ds']['graphs'] = dsCount

  Constants.colonyToDomainMapping['ds'] = {}
  Constants.colonyToDomainMapping['ds'][dsCount-5] = { "name": "Lists", "slug": "lists" }
  Constants.colonyToDomainMapping['ds'][dsCount-4] = { "name": "Arrays", "slug": "arrays" }
  Constants.colonyToDomainMapping['ds'][dsCount-3] = { "name": "Stacks/Queues", "slug": "stacks-queues" }
  Constants.colonyToDomainMapping['ds'][dsCount-2] = { "name": "Trees", "slug": "trees" }
  Constants.colonyToDomainMapping['ds'][dsCount-1] = { "name": "Hash/Maps", "slug": "hash-maps" }
  Constants.colonyToDomainMapping['ds'][dsCount] = { "name": "Graphs", "slug": "graphs" }

  //////////////////////////////////////////////////////////////////
  // Initialize the Miscellaneous colony
  //////////////////////////////////////////////////////////////////
  const miscColonyClient = await networkClient.getColonyClient(miscData.eventData.colonyId)
  console.log('Connected to Miscellaneous Colony Client.')
  const miscSkillId = await miscColonyClient.getDomain.call({ domainId: 1 })

  console.log('Creating Domains')
  // maths, sql
  await miscColonyClient.addDomain.send({parentSkillId: miscSkillId.localSkillId})
  console.log('1/2...')
  await miscColonyClient.addDomain.send({parentSkillId: miscSkillId.localSkillId})
  console.log('2/2...')

  // use miscCount -0, -1, -2 etc respectively for above domains
  count = await miscColonyClient.getDomainCount.call()
  let miscCount = count.count

  // update the ids in constants file
  Constants.domainNameToIdMapping['misc']['maths'] = miscCount-1
  Constants.domainNameToIdMapping['misc']['sql'] = miscCount

  Constants.colonyToDomainMapping['misc'] = {}
  Constants.colonyToDomainMapping['misc'][miscCount-1] = { "name": "Maths", "slug": "maths" }
  Constants.colonyToDomainMapping['misc'][miscCount] = { "name": "SQL", "slug": "sql" }

  // write the updates to file
  fs.writeFileSync(__dirname + '/app/generated_constants.js', 'module.exports = ' + JSON.stringify(Constants, null, 2))
  console.log('Writing updated IDs to file.')

  console.log('Finished!')
  return
};

createColony().then(() => process.exit()).catch(err => console.error(err))
