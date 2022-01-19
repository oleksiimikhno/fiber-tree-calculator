'use strict';

let objSplit = {
    FBT: {
        '5_95': {
            5: 13.7, 95: 0.32
        },
        '10_90': {
            10: 10.08, 90: 0.49
        },
        '15_85': {
            15: 8.16, 85: 0.76
        },
        '20_80': {
            20: 7.11, 88: 1.06
        },
        '25_75': {
            15: 6.29, 85: 1.42
        },
        '30_70': {
            30: 5.39, 70: 1.56
        },
        '35_65': {
            35: 4.56, 65: 1.93
        },
        '40_60': {
            40: 4.01, 60: 2.34
        },
        '45_55': {
            45: 3.73, 55: 2.71
        },
        '50_50': {
            50: 3.17, 51: 3.19
        },
    },
    PLC: {
        '1x2': 4.3,
        '1x4': 7.4,
        '1x8': 10.7,
        '1x16': 13.9
    }
}

let resultSignal = document.querySelector('#result-signal');
let calcContainer = document.querySelector('#calculator');

calcContainer.addEventListener('change', (event) => {
    const target = event.target;

    let [selectType, selectFiber] = [target.matches('.select-type'), target.matches('.select-fiber')]
////////////////Continue her
    if (selectType || selectFiber) {
        (selectType || selectFiber) ? changeSplitData(target, selectType) : changeSplitData(target, selectFiber);
    };
////////////////Continue her
    let inSignal = document.querySelector('#in-signal[name="in-signal"]:valid').value;
    calcSignal(inSignal);


});

let changeSplitData = (option, selectedType) => {
    let split = option.closest('.split');
    let [id, type] = [split.dataset.id, split.dataset.type];
    let outSplit = split.querySelector('.out-split');
    let rows = split.querySelectorAll(`.row[data-id="${id}"] `);

    let selectedOption = option.options[option.selectedIndex].value;

    if (selectedType) {
       
        split.dataset.type = selectedOption;
        split.dataset.fiber = createSplitOptions(split, selectedOption);
        
        if (selectedOption === 'FBT') {
            cleanOutRowsSplit(rows, rows.length)
        }

    } else {
        let getLenghtOutFibers = selectedOption.replace(/1x/, '');
        split.dataset.fiber = selectedOption;
        
        if (type === 'PLC' && getLenghtOutFibers > rows.length) {
            for (let i = rows.length; i < getLenghtOutFibers; i++) {
                outSplit.insertAdjacentHTML('beforeend', `<div class="row" data-id="${id}"><input class="out-signal" data-id="${id}" name="out-split" value="0" disabled><button class="btn-split create-split">+</button></div>`);
            }
        } else {
            cleanOutRowsSplit(rows, rows.length, getLenghtOutFibers)
        }
    }
};

let cleanOutRowsSplit = (rows, rowsLenght, lenghtOutFibers = 2) => {
    for (let i = rowsLenght - 1; i >= lenghtOutFibers; --i) {
        rows[i].remove()
    }
};

let createSplitOptions = (split, splitType) => {
    let splitFiber = split.querySelector('.select-fiber');

    splitFiber.innerHTML = '';
    let outFibers = Object.keys(objSplit[splitType]);

    [...outFibers].forEach((item)  =>  { 
        let option = document.createElement('option');
        option.value = item;
        option.innerText = item.replace(/x/, '/');

        splitFiber.append(option);
    });

    return outFibers[0];
};

let calcSignal = (inSignal) => {
    [...document.querySelectorAll('.split')].forEach((split) => {
        let [idDataSplit, typeDataSplit, fiberDataSplit] = [split.dataset.id, split.dataset.type, split.dataset.fiber];
        let dataSplit = objSplit[typeDataSplit][fiberDataSplit];
       
        let splitInSignal = split.previousElementSibling.previousElementSibling;
        // console.log('splitInSignal: ', splitInSignal);
        // console.log('splitInSignal: ', Number(splitInSignal));
        let setSplitSignal = split.closest('.row').querySelector('.in-split').value = splitInSignal = (splitInSignal === null) ? inSignal : splitInSignal.value;
        // console.log('setSplitSignal: ', setSplitSignal);

        let outSplitSignalElement = split.querySelectorAll(`.out-signal[data-id='${idDataSplit}']`);
        
        let nameSplit, valueSplit, result;
        if (typeDataSplit === 'FBT') {
            let i = 0;

            for ([nameSplit, valueSplit] of Object.entries(dataSplit)) {
                result = splitInSignal - valueSplit;
                outSplitSignalElement[i].value = result.toFixed(2);

                i++;
            }

        } else {
            valueSplit = dataSplit;
            result = splitInSignal - valueSplit;

            [...outSplitSignalElement].forEach((element) =>{
                element.value = result.toFixed(2);
            })
        }
    });
};

let idSplit = 1;
calcContainer.addEventListener('click', (event) => {
    const target = event.target;
    
    if (target.matches('.create-split')) {
        let addSplit = createSplit(idSplit++);
        target.insertAdjacentHTML('afterend', addSplit);

        target.textContent = '-';
        target.classList.replace('create-split','remove-split');
    } else if(target.matches('.remove-split')) {
        let removeBtn = target;
        let hasChainSplitter = removeBtn.nextElementSibling.querySelector('.remove-split');

        if (hasChainSplitter) {
            (confirm('You want remove chain splitter?')) ? removeChainSplitter() : false ;
        } else {
            removeChainSplitter();
        }

        function removeChainSplitter() {
            removeBtn.nextElementSibling.remove();
            removeBtn.textContent = '+';
            removeBtn.classList.replace('remove-split','create-split');
        }
    }
});

let createSplit = (id) => {
    return `
    <div class="split" data-id="${id}" data-type="FBT" data-fiber="5_95">
        <select class="select-type">
            <option value="FBT">FBT</option>
            <option value="PLC">PLC</option>
        </select>
        <select class="select-fiber">
            <option value="5_95">5/95</option>
            <option value="10_90">10/90</option>
            <option value="15_85">15/85</option>
            <option value="20_80">20/80</option>
            <option value="25_75">25/75</option>
            <option value="30_70">30/70</option>
            <option value="35_65">35/65</option>
            <option value="40_60">40/60</option>
            <option value="45_55">45/55</option>
            <option value="50_50">50/50</option>
        </select>
        <input class="in-split" name="in-signal" value="0" disabled>
        <div class="column out-split">
            <div class="row" data-id="${id}"><input class="out-signal" data-id="${id}" name="out-split" value="0" disabled><button class="btn-split create-split">+</button></div>
            <div class="row" data-id="${id}"><input class="out-signal" data-id="${id}" name="out-split" value="0" disabled><button class="btn-split create-split">+</button></div>
        </div>
    </div>`;
};

let setSplitType = () => {
    [...document.querySelectorAll('.split')].forEach((split) => {
       let data =  split.dataset.type;
       let selectType = split.querySelector('.select-type');
       selectType = (selectType === null) ? false : selectType.getElementsByTagName('option'); 
       console.log('selectType: ', selectType);

       for (let i = 0; i < selectType.length; i++) {
            if (selectType[i].value === data){
                selectType[i].selected = true;
            };
        }
    });
};

setSplitType();