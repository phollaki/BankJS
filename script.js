'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const sortedMovs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  sortedMovs.forEach(function (value, key) {
    const type = value > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      key + 1
    } ${type}</div>
      <div class="movements__value">${value}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = function (accounts) {
  accounts.forEach(
    (account, key) =>
      (account.username = account.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''))
  );
};

createUsernames(accounts);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${incomes}€`;

  const deficit = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${deficit}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc =>
      acc.username === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
  );
  if (currentAccount) {
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }!`;
    inputLoginPin.value = inputLoginUsername.value = '';

    displayMovements(currentAccount);
    calcDisplaySummary(currentAccount);
    calcPrintBalance(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    recieverAccount &&
    recieverAccount.username !== currentAccount.username
  ) {
    recieverAccount.movements.push(amount);
    currentAccount.movements.push(-amount);
    displayMovements(currentAccount);
    calcDisplaySummary(currentAccount);
    calcPrintBalance(currentAccount);
    inputTransferAmount.value = inputTransferTo.value = '';
    labelWelcome.textContent = `Money send to ${recieverAccount.username}`;
  } else {
    labelWelcome.textContent = `Not valid input!`;
  }
  console.log(currentAccount);
  console.log(recieverAccount);
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputClosePin.value = inputCloseUsername.value = '';
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    currentAccount.movements.push(loanAmount);
    calcPrintBalance(currentAccount);
    calcDisplaySummary(currentAccount);
    displayMovements(currentAccount);
  }
});
let sort = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sort = !sort;
  displayMovements(currentAccount, sort);
});

/* const allMoves = accounts
  .flatMap(el2 => el2.movements)
  .reduce((cur, acc) => cur + acc);
console.log(allMoves); */
/* 
const balanceValues = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;
const totalDeposit = balanceValues
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  // .map((mov, i, arr) => {
  //   console.log(arr);
  //   return mov * eurToUsd;
  // })
  .reduce((acc, cur) => acc + cur);
console.log(totalDeposit.toFixed(0) + ' EUR');
 */
/* const balanceValues = [200, 450, -400, 3000, -650, -130, 70, 1300];
const balance = balanceValues.reduce(function (acc, cur, key, arr) {
  console.log(`Iteration ${key}: ${acc}`);
  return acc + cur;
}, 0);
console.log(balance); */
/* 
const eurToUsd = 1.1;
const mov = [200, 450, -400, 3000, -650, -130, 70, 1300];

const movementUsd = mov.map(m => m * eurToUsd);
console.log(mov);
console.log(movementUsd);
const movementsUSDfor = [];
for (const m of mov) {
  movementsUSDfor.push(m * eurToUsd);
}
console.log(movementsUSDfor);
 */
/* 
Julia and Kate are doing a study on dogs. 
So each of them asked 5 dog owners about their dog's age,
 and stored the data into an array (one array for each). 
 For now, they are just interested in knowing whether a 
 dog is an adult or a puppy. A dog is an adult if it is at 
 least 3 years old, and it's a puppy if it's less than 3 
 years old.

Create a function 'checkDogs', which accepts 2 arrays of 
dog's ages ('dogsJulia' and 'dogsKate'), and does the 
following things:

1. Julia found out that the owners of the FIRST and the 
LAST TWO dogs actually have cats, not dogs! So create a 
shallow copy of Julia's array, and remove the cat ages from 
that copied array (because it's a bad practice to mutate 
function parameters)

2. Create an array with both Julia's (corrected) and Kate's 
data

3. For each remaining dog, log to the console whether it's 
an adult ("Dog number 1 is an adult, and is 5 years old")
 or a puppy ("Dog number 2 is still a puppy 🐶")

4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

/* const dogsJ = [3, 5, 2, 12, 7];
const dogsK = [4, 1, 15, 8, 3];
const dogsJ2 = [9, 16, 6, 8, 3];
const dogsK2 = [10, 5, 6, 1, 4];
const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCopy = [...dogsJulia];
  dogsJuliaCopy.splice(1, dogsJuliaCopy.length - 3);
  const correctedDogs = [...dogsJuliaCopy, ...dogsKate];
  correctedDogs.forEach(function (dog, key, arr) {
    if (dog >= 3) {
      console.log(`${key}th dog is ${dog} years old, it's an adult dog`);
    } else {
      console.log(`${key}th dog is ${dog} years old, it is a puppy`);
    }
  });
};
checkDogs(dogsJ, dogsK);
checkDogs(dogsJ2, dogsK2); 


Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which 
accepts an arrays of dog's ages ('ages'), and does 
the following things in order:

1. Calculate the dog age in human years using 
the following formula: if the dog is <= 2 years 
old, humanAge = 2 * dogAge. If the dog is > 2 years 
old, humanAge = 16 + dogAge * 4.

2. Exclude all dogs that are less than 18 human 
years old (which is the same as keeping dogs that 
  are at least 18 years old)

3. Calculate the average human age of all adult dogs
(you should already know from other challenges how 
we calculate averages 😉)

4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀*/
/* const dogAges1 = [5, 2, 4, 1, 15, 8, 3];
const dogAges2 = [16, 6, 10, 5, 6, 1, 4];
const calcHumanAge = function (ages) {
  const humanAges = ages
    .map(age => (age <= 2 ? age * 2 : 4 * age + 16))
    .filter(humanAge => humanAge >= 18);
  const avgHumanAge =
    humanAges.reduce((acc, cur) => acc + cur, 0) / humanAges.length;
  console.log(`${humanAges}\nAverage human age = ${avgHumanAge}`);
};
calcHumanAge(dogAges1);
calcHumanAge(dogAges2);
 */
/*
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
const currenciesUnique = new Set(['USD', 'GDP', 'EUR', 'EUR', 'USD', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (curr, i, arr) {
  console.log(curr);
});
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
for (const value of movements) {
  if (value > 0) {
    console.log(`You deposited ${value}`);
  } else {
    console.log(`You withdrew ${Math.abs(value)}`);
  }
}
console.log('----FOREACH----');
let deposit = 0;
movements.forEach(function (movement, i, arr) {
  deposit = deposit + movement;
  console.log(`Your deposit ${deposit}`);
}); */
/////////////////////////////////////////////////
/* 
let arr = ['a', 'b', 'c', 'd', 'e', 'e'];
let arr2 = ['i', 'h', 'l', 'm', 'n', 'e', 'i'];
//SLICE
console.log(arr.slice(2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
//SPLICE - It modifies the original array
console.log(arr.splice(-1));
console.log(arr);
//REVERSE
console.log(arr.reverse());
//CONCAT
console.log(arr.concat(arr2));
const combine = [...arr, ...arr2];
//JOIN
console.log(combine.join('-'));
 */
