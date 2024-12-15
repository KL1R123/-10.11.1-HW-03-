const fruitsList = document.querySelector('.fruits__list'); 
const shuffleButton = document.querySelector('.shuffle__btn'); 
const filterButton = document.querySelector('.filter__btn');
const sortKindLabel = document.querySelector('.sort__kind');
const sortTimeLabel = document.querySelector('.sort__time'); 
const sortChangeButton = document.querySelector('.sort__change__btn'); 
const sortActionButton = document.querySelector('.sort__action__btn'); 
const kindInput = document.querySelector('.kind__input'); 
const colorInput = document.querySelector('.color__input'); 
const weightInput = document.querySelector('.weight__input'); 
const addActionButton = document.querySelector('.add__action__btn'); 
const minWeightInput = document.querySelector('.minweight__input'); 
const maxWeightInput = document.querySelector('.maxweight__input'); 


let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;


let fruits = JSON.parse(fruitsJSON);




const createFruitElement = (fruit, index) => {
  const listItem = document.createElement('li');
  listItem.classList.add('fruit__item');
  listItem.classList.add(`fruit_${getColorClass(fruit.color)}`);


  const fruitInfo = document.createElement('div');
  fruitInfo.classList.add('fruit__info');
  
  const indexDiv = document.createElement('div');
  indexDiv.textContent = `index: ${index}`;
  fruitInfo.appendChild(indexDiv);

  const kindDiv = document.createElement('div');
  kindDiv.textContent = `kind: ${fruit.kind}`;
  fruitInfo.appendChild(kindDiv);

  const colorDiv = document.createElement('div');
  colorDiv.textContent = `color: ${fruit.color}`;
  fruitInfo.appendChild(colorDiv);

  const weightDiv = document.createElement('div');
  weightDiv.textContent = `weight (кг): ${fruit.weight}`;
  fruitInfo.appendChild(weightDiv);

  listItem.appendChild(fruitInfo);

  return listItem;
};


const getColorClass = (color) => {
  const colorMap = {
    "фиолетовый": "violet",
    "зеленый": "green",
    "розово-красный": "carmazin",
    "желтый": "yellow",
    "светло-коричневый": "lightbrown",
  };
  return colorMap[color.toLowerCase()] || "default";
}



const display = () => {
  fruitsList.innerHTML = ''; 
  fruits.forEach((fruit, index) => {
    const listItem = createFruitElement(fruit, index);
    fruitsList.appendChild(listItem);
  });
};


display();




const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


const shuffleFruits = () => {
    const originalFruits = [...fruits];
  let result = [];

  while (fruits.length > 0) {
    const randomIndex = getRandomInt(0, fruits.length - 1);
    const removedElement = fruits.splice(randomIndex, 1)[0];
    result.push(removedElement);
  }

  fruits = result;
    
    let isSame = true;
     for (let i = 0; i < originalFruits.length; i++) {
       if (originalFruits[i] !== result[i]) {
         isSame = false
         break;
       }
    }
    if (isSame) {
        alert('Порядок не изменился!');
    }

};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});




const filterFruits = () => {
   const minWeight = parseFloat(minWeightInput.value) || -Infinity;
   const maxWeight = parseFloat(maxWeightInput.value) || Infinity;
  
  fruits = fruits.filter((fruit) => {
      return fruit.weight >= minWeight && fruit.weight <= maxWeight;
  });
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});



let sortKind = 'bubbleSort';
let sortTime = '-'; 

const comparationColor = (a, b) => {
    const priority = ['фиолетовый', 'розово-красный', 'зеленый', 'желтый', 'светло-коричневый'];
    const colorA = a.color.toLowerCase();
    const colorB = b.color.toLowerCase();
    
    const indexA = priority.indexOf(colorA);
    const indexB = priority.indexOf(colorB);
    
    if (indexA < 0) return 1;
    if (indexB < 0) return -1;

    return indexA - indexB;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
      const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (comparation(arr[j], arr[j + 1]) > 0) {
                
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
            }
        }
    },

  quickSort(arr, comparation) {
        if (arr.length <= 1) {
      return arr;
    }

    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const middle = [];
    const right = [];

    for (const item of arr) {
      if (comparation(item, pivot) < 0) {
        left.push(item);
      } else if (comparation(item, pivot) > 0) {
        right.push(item);
      } else {
        middle.push(item);
      }
    }

    return [...sortAPI.quickSort(left, comparation), ...middle, ...sortAPI.quickSort(right, comparation)];
  },

 
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    if (sort === sortAPI.quickSort) {
      arr = sort(arr, comparation)
    } else {
       sort(arr, comparation);
    }
   
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'sorting...';
  const sort = sortAPI[sortKind];
   sortAPI.startSort(sort, fruits, comparationColor);
   if (sort === sortAPI.quickSort) {
        fruits = sort(fruits, comparationColor)
    }
    display();
   sortTimeLabel.textContent = sortTime;
});


addActionButton.addEventListener('click', () => {
  const kind = kindInput.value.trim();
  const color = colorInput.value.trim();
  const weight = parseFloat(weightInput.value);

  if (!kind || !color || isNaN(weight)) {
    alert('Пожалуйста, заполните все поля!');
    return;
  }

  const newFruit = { kind, color, weight };
  fruits.push(newFruit);
    
  kindInput.value = '';
  colorInput.value = '';
  weightInput.value = '';
    
  display();
});