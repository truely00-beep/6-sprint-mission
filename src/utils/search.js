// search.js

/**
 * 배열 내 객체에서 특정 키워드로 검색하는 함수
 * @param {Array} items - 검색 대상 배열 (객체의 배열)
 * @param {String} keyword - 검색어
 * @param {String} field - 검색할 필드명
 * @returns {Array} 검색 결과
 */
function search(items, keyword, field) {
  if (!keyword || !field) return [];
  const lowerKeyword = keyword.toLowerCase();
  return items.filter(item =>
    item[field] && item[field].toLowerCase().includes(lowerKeyword)
  );
}

// 사용 예시:
const data = [
  { id: 1, name: "Snow Park" },
  { id: 2, name: "Green Park" },
  { id: 3, name: "Snowy Hill" }
];

const results = search(data, "snow", "name");
console.log(results); // [{id:1, name:"Snow Park"}, {id:3, name:"Snowy Hill"}]

module.exports = search;
