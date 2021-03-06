const dcsdk = require("dragonchain-sdk");
const badger = require("./dragon-badges");

const log = (string) => console.error(`STDERR: ${string}`);

module.exports = async inputObj => {

  try {
    badger.client = await dcsdk.createClient();

    badger.config.publicKey = await badger.client.getSmartContractSecret({secretName: "publicsigningkey"});
    badger.config.privateKey = await badger.client.getSmartContractSecret({secretName: "privatesigningkey"});

    let output = await Reflect.apply(
      badger[inputObj.payload.method],
      badger,
      [
        inputObj.header.txn_id,
        inputObj.payload.parameters
      ]
    );

    return output;
        
  } catch (exception)    
  {
      // Write the exception to STDERR
      log(exception);

      return {"exception": exception};  
  }
}