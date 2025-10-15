import { getProductList } from './service/Service_Product.js';
import Product from './lib/Class_Product.js';
import ElectronicProduct from './lib/Class_ElectronicProduct.js';
import { StrFuns, print } from '../lib/myFuns.js'; // import the functions defined by babo

const params = {
  // parameters for data retrieval
  page: 1, // only 4 paramters are allowed
  pageSize: 10,
  orderBy: 'recent',
  //keyword: '스웨터',
};

// retrieving product data from API server
const products = await getProductList(params);

// print(products);
// print('-----------------------------------');

let eProductInstance = []; // an array for Product Instances
let productInstance = []; // an array for ElectronicProduct Instances
let tagStr = '';

let nEP = 0; // counter for ElectronicProduct Instancess
let nP = 0; // counter for Product Instances

print('Sorting...'); // sort retreived products by a tag '전자제품'
print('-----------------------------------');

for (let i = 0; i < products.length; i++) {
  tagStr = StrFuns.trimAll([...products[i].tags].join(''));

  // sort by the tag: '전자제품' or '전자 제품'
  if (tagStr.includes('전자제품') || tagStr.includes('전자')) {
    eProductInstance.push(new ElectronicProduct(products[i]));
    print(`${products[i].id}: 전자제품 <- ${products[i].tags}`);
    ++nEP;
  } else {
    productInstance.push(new Product(products[i]));
    print(`${products[i].id}: 비전자제품 <- ${products[i].tags}`);
    ++nP;
  }
}

//print result
print(productInstance); // view the array for Product Instances
print(eProductInstance); // view the array for Electronic Product Instances
print_summary(nP, nEP);

// print(eProductInstance[0].viewAll()); // view all properties including private

// test #favoriteCount works as intended
// print(eProductInstance[0].favoriteCount)
// eProductInstance[0].favoriteCount = 100;

// print(eProductInstance[0].favoriteCount);  // test favorite() method
// eProductInstance[0].favorite()
// eProductInstance[0].favorite()
// eProductInstance[0].favorite()
// print(eProductInstance[0].favoriteCount);

function print_summary(n1, n2) {
  print('-----------------------------------'); // view the summary
  print(`products, retrieved:        ${n1 + n2}`); // total products from the servier
  print(`products, electronic:       ${n2}`); // number of Electronic Product Instances
  print(`products, non-electronic:   ${n1}`); // number of non-Electronic Product Instances
  print('');
}
