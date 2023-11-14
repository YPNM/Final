let web3, contract, userAddress;

window.onload = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.enable();
    } catch (error) {
      alert('You need to allow access to your MetaMask account.');
      return;
    }
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
  } else {
    alert('Please install MetaMask!');
    return;
  }

  const abi = await fetch('js/contractABI.json').then(response => response.json());

  try {
    contract = new web3.eth.Contract(abi, '0x5435B6233964B47D9532b715d12f6694D89D189D');
    console.log("Contract loaded successfully");
  } catch (error) {
    console.error("Error loading contract:", error);
  }

  document.getElementById('connectMetamask').onclick = async () => {
    const accounts = await web3.eth.getAccounts();
    userAddress = accounts[0];
    document.getElementById('userAddress').innerText = "User address = " + userAddress;
    updateBalance();
  };
};

async function depositFunds() {
  const depositAmount = prompt("Enter the deposit amount:");
  if (isNaN(depositAmount) || depositAmount <= 0) {
      alert("Invalid deposit amount");
      return;
  }

  try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.depositFunds().send({
          from: accounts[0],
          value: web3.utils.toWei(depositAmount, 'ether') // Преобразуем в wei
      });

      console.log("Deposit successful");
      updateBalance();
  } catch (error) {
      console.error("Error depositing funds:", error);
  }
}

async function getLastResult() {
  try {
    const result = await contract.methods.lastResult().call();
    console.log('Last result:', result.toString());
    return result;
  } catch (error) {
    console.error('Error fetching last result:', error);
  }
}

async function placeBet() {
  const betAmount = document.getElementById('betAmount').value;
  try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.placeBetAndSpin(web3.utils.toWei(betAmount, 'ether')).send({ from: accounts[0] });
  } catch (error) {
      console.error("Error placing bet:", error);
  }
}

async function withdrawFunds() {
  const withdrawAmount = document.getElementById('withdrawAmount').value;
  try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.withdrawFunds(withdrawAmount).send({ from: accounts[0] });
  } catch (error) {
      console.error("Error withdrawing funds:", error);
  }
}

async function updateBalance() {
  try {
    // Проверяем, что контракт успешно загружен
    if (!contract) {
        console.error("Contract is not loaded");
        return;
    }

    const accounts = await web3.eth.getAccounts();
    const balance = await contract.methods.playerBalances(accounts[0]).call({ from: accounts[0] });

    document.getElementById('userBalance').innerText = "Your balance = " + web3.utils.fromWei(balance, 'ether');
  } catch (error) {
    console.error("Error updating balance:", error);
  }
}

async function withdrawFunds() {
  const withdrawAmount = prompt("Enter the withdrawal amount:");
  if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
    alert("Invalid withdrawal amount");
    return;
  }
  try {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.withdrawFunds(web3.utils.toWei(withdrawAmount, 'ether')).send({
      from: accounts[0],
    });

    console.log("Withdrawal successful");
  } catch (error) {
    console.error("Error withdrawing funds:", error);
  }
  updateBalance();
}


