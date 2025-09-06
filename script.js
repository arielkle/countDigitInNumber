document.addEventListener('DOMContentLoaded', function() {

    const numberInput = document.getElementById('numberInput');
    const digitInput = document.getElementById('digitInput');
    const runButton = document.getElementById('runButton');
    const outputDiv = document.getElementById('output');
    let delay = 250; // ms

    runButton.addEventListener('click', () => {
        const num = parseInt(numberInput.value);
        const digit = parseInt(digitInput.value);

        if (isNaN(num) || isNaN(digit) || num < 0 || digit < 0 || digit > 9) {
            outputDiv.innerHTML = '<p class="text-red-400">נא להזין מספר חיובי וספרה בודדת (0-9).</p>';
            return;
        }
        
        runButton.disabled = true;
        runButton.textContent = '...מריץ הדמיה...';
        runButton.classList.add('cursor-not-allowed', 'bg-gray-400');


        outputDiv.innerHTML = '';
        runSimulation(num, digit, 0).finally(() => {
            runButton.disabled = false;
            runButton.textContent = 'הפעל הדמיה';
            runButton.classList.remove('cursor-not-allowed', 'bg-gray-400');
        });
    });

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function runSimulation(num, digit, depth) {
        const frameId = `frame-${depth}-${num}`;
        const frame = document.createElement('div');
        frame.id = frameId;
        frame.className = 'call-stack-frame shadow-md';
        frame.style.marginRight = `${depth * 25}px`;
        
        const borderColors = ['border-sky-500', 'border-emerald-500', 'border-amber-500', 'border-purple-500', 'border-rose-500'];
        const bgColors = ['bg-sky-50', 'bg-emerald-50', 'bg-amber-50', 'bg-purple-50', 'bg-rose-50'];
        frame.classList.add(borderColors[depth % borderColors.length], bgColors[depth % bgColors.length]);

        outputDiv.appendChild(frame);

        let callHtml = `<div class="mb-2"><span class="text-gray-500">${'| '.repeat(depth)}</span><span class="text-cyan-700">קורא ל-</span> <span class="font-bold text-gray-900">countSpecificDigit(${num}, ${digit})</span></div>`;
        frame.innerHTML = callHtml;
        await sleep(delay * 2);

        if (num === 0) {
            let baseCaseHtml = `<div class="ml-4"><span class="text-gray-500">${'| '.repeat(depth)}</span><span class="text-yellow-600">תנאי עצירה:</span> num == 0. <span class="font-bold text-yellow-700">מחזיר 0</span></div>`;
            frame.innerHTML += baseCaseHtml;
            await sleep(delay);
            return 0;
        }

        const lastDigit = num % 10;
        let checkHtml = `<div class="ml-4"><span class="text-gray-500">${'| '.repeat(depth)}</span><span class="text-purple-700">בדיקה:</span> האם הספרה האחרונה (${lastDigit}) שווה ל-${digit}?</div>`;
        frame.innerHTML += checkHtml;
        await sleep(delay * 2);

        let recursiveResult;
        if (lastDigit === digit) {
            let matchHtml = `<div class="ml-8 text-green-700"><span class="text-gray-500">${'| '.repeat(depth)}</span><span class="font-bold">כן!</span> נמצאה התאמה.</div>`;
            matchHtml += `<div class="ml-8"><span class="text-gray-500">${'| '.repeat(depth)}</span><span class="text-cyan-700">נחשב:</span> 1 + התוצאה של הקריאה הבאה...</div>`;
            frame.innerHTML += matchHtml;
            await sleep(delay);
            
            recursiveResult = await runSimulation(Math.floor(num / 10), digit, depth + 1);
            
            let returnHtml = `<div class="mt-2"><span class="text-gray-500">${'| '.repeat(depth)}</span><span class="font-bold">←</span> <span class="font-bold text-gray-900">countSpecificDigit(${num}, ${digit})</span> <span class="text-cyan-700">מחזיר</span> <span class="ml-2 inline-block font-bold text-lg bg-green-200 text-green-800 px-2 py-1 rounded">1 + ${recursiveResult} = ${1 + recursiveResult}</span></div>`;
            frame.innerHTML += returnHtml;
            await sleep(delay * 2);
            
            if (depth === 0) {
                outputDiv.innerHTML += `<hr class="my-4 border-gray-300"><div class="text-2xl text-center font-bold text-green-600">התוצאה הסופית: ${1 + recursiveResult}</div>`;
            }

            return 1 + recursiveResult;

        } else {
            let noMatchHtml = `<div class="ml-8 text-red-700"><span class="text-gray-500">${'| '.repeat(depth)}</span><span class="font-bold">לא.</span> אין התאמה.</div>`;
            noMatchHtml += `<div class="ml-8"><span class="text-gray-500">${'| '.repeat(depth)}</span><span class="text-cyan-700">נחשב:</span> 0 + התוצאה של הקריאה הבאה...</div>`;
            frame.innerHTML += noMatchHtml;
            await sleep(delay);

            recursiveResult = await runSimulation(Math.floor(num / 10), digit, depth + 1);
            
            let returnHtml = `<div class="mt-2"><span class="text-gray-500">${'| '.repeat(depth)}</span><span class="font-bold">←</span> <span class="font-bold text-gray-900">countSpecificDigit(${num}, ${digit})</span> <span class="text-cyan-700">מחזיר</span> <span class="ml-2 inline-block font-bold text-lg bg-gray-200 text-gray-800 px-2 py-1 rounded">0 + ${recursiveResult} = ${recursiveResult}</span></div>`;
            frame.innerHTML += returnHtml;
            await sleep(delay * 2);

            if (depth === 0) {
                outputDiv.innerHTML += `<hr class="my-4 border-gray-300"><div class="text-2xl text-center font-bold text-green-600">התוצאה הסופית: ${recursiveResult}</div>`;
            }

            return recursiveResult;
        }
    }
});




