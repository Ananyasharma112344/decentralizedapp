console.log('Hello World');
// connect to Moralis server

serverUrl = "https://9vqvkndunnuc.usemoralis.com:2053/server"
appId =  "AaV8PX1ixDsrxyamiCulAxgaASyNtsXtBHAMljwU" 
Moralis.start({ serverUrl, appId});
let homepage = "http://127.0.0.1:5500/index.html"
if (Moralis.User.current() == null && window.location.href!=homepage){
  document.querySelector('body').style.display = "none";
  window.location.href = "index.html";

}


login = async() => {
  await Moralis.Web3.authenticate().then(async function (user) {
    console.log('logged in');
    user.set("name", document.getElementById('user-username').value);
    user.set("email", document.getElementById('user-email').value);
    await user.save();
    window.location.href = "dashboard.html";
    
  })
}
logout = async() => {
  await Moralis.User.logout();
  window.location.href = "index.html";
}
getTransactions = async() =>{
  console.log('get transactions clicked');
  const options = { chain: "rinkeby", address: "0x8E401A06C1D065941636908887568E9f35e6AB11" };
  const transactions = await Moralis.Web3API.account.getTransactions(options);
  console.log(transactions);
  if(transactions.total > 0){
    let table = `
    <table class="table">
    <thead>
      <tr>
        <th scope="col" >Transaction</th>
        <th scope="col" >Block Number</th>
        <th scope="col" >Age</th>
        <th scope="col" >Type</th>
        <th scope="col" >Fee</th>
        <th scope="col" >Value</th>
      </tr>
    </thead>
    <tbody id="theTransactions">

    </tbody>
    </table>
    `
    document.querySelector('#tableofTransactions').innerHTML = table;
    transactions.result.forEach(t => {
      let content = `
      <tr>
        <td><a href='https://rinkeby.etherscan.io/tx/ ${t.hash}' target="_blank" rel="noopener noreferrer">${t.hash}</a></td>
        <td><a href='https://rinkeby.etherscan.io/block/ ${t.block_number}' target="_blank" rel="noopener noreferrer">${t.block_number}</a></td>
        <td>${millisecondsToTime(Date.parse(new Date()) - Date.parse(t.block_timpestamp))}</td>
        <td>${t.block_timestamp == Moralis.User.current().get('ethAddress') ? 'Outgoing' : 'Incoming'}</td>
        <td>${t.from_address}</td>
        <td>${((t.gas * t.gas_price) / 1e18).toFixed(5)} ETH</td>
        <td>${t.value} ETH</td>

      </tr>
      `
      theTransactions.innerHTML += content;
    })
    
    

  }

}
getBalances = async() =>{
  console.log('get Balances clicked');
  const ropstenbalance = await Moralis.Web3API.account.getNativeBalance();
  const ethbalance = await Moralis.Web3API.account.getNativeBalance({chain: "ropsten"});
  const rinkebybalance = await Moralis.Web3API.account.getNativeBalance({chain: "rinkeby"});
  console.log( (ropstenbalance.balance / 1e18).toFixed(5) + "ETH");
  console.log( (ethbalance.balance / 1e18).toFixed(5) + "ETH");
  console.log( (rinkebybalance.balance / 1e18).toFixed(5) + "ETH");
  let content = document.querySelector('#userBalances').innerHTML = 
`
  <table class="table">
    <thead>
      <tr>
        <th scope="col" >Chain</th>
        <th scope="col" >Balance</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Ether</th>
        <td>${(ethbalance.balance / 1e18).toFixed(5)} ETH</td>
      </tr>
      <tr>
        <th>Ropsten</th>
        <td>${(ropstenbalance.balance / 1e18).toFixed(5)} ETH</td>
      </tr>
      <tr>
        <th>Rinkeby</th>
        <td>${(rinkebybalance.balance / 1e18).toFixed(5)} ETH</td>
      </tr>
      

    </tbody>
    </table>
 ` 
 
}


millisecondsToTime = (ms) => {
  let minutes = Math.floor(ms / (1000 * 60));
  let hours = Math.floor(ms / (1000 * 60 * 60));
  let days = Math.floor(ms / (1000 * 60 * 60 * 24));
  
  
  if(days<1){
    if(hours<1){
      if(minutes<1){
        return `less than a minute ago`
      } else return `${minutes} minutes(s) ago`
    } else return `${hours} hours(s) ago`
  } else return `${days} days(s) ago`
}
if(document.querySelector('#btn-login') != null){
  document.querySelector('#btn-login').onclick = login;
  

}
if(document.querySelector('#btn-logout') != null){
  document.querySelector('#btn-logout').onclick = login;

}

if(document.querySelector('#get-transactions-link') != null){
  document.querySelector('#get-transactions-link').onclick = getTransactions;

}

if(document.querySelector('#get-Balances-link') != null){
  document.querySelector('#get-Balances-link').onclick = getBalances;

}


