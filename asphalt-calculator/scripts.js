document.addEventListener('DOMContentLoaded', () => {
    
    // Elements
    const btnCalc = document.getElementById('calcBtn');
    const btnClear = document.getElementById('clearBtn');
    const toggleAdv = document.getElementById('advToggle');
    const advSection = document.getElementById('advSection');
    const resultBox = document.getElementById('resultBox');

    // Inputs
    const lengthInput = document.getElementById('length');
    const widthInput = document.getElementById('width');
    const depthInput = document.getElementById('depth');
    const priceInput = document.getElementById('price');
    const densityInput = document.getElementById('density');
    const wasteInput = document.getElementById('waste');

    // Units
    const lUnit = document.getElementById('lengthUnit');
    const wUnit = document.getElementById('widthUnit');
    const dUnit = document.getElementById('depthUnit');

    // Outputs
    const resTons = document.getElementById('resTons');
    const resArea = document.getElementById('resArea');
    const resVol = document.getElementById('resVol');
    const resCost = document.getElementById('resCost');
    const costDiv = document.getElementById('costResult');

    // Toggle Advanced Section
    toggleAdv.addEventListener('click', () => {
        advSection.classList.toggle('show');
        toggleAdv.textContent = advSection.classList.contains('show') 
            ? "Hide Advanced Settings ▲" 
            : "Show Advanced Settings (Cost & Density) ▼";
    });

    // Calculate Logic
    btnCalc.addEventListener('click', () => {
        const L = parseFloat(lengthInput.value);
        const W = parseFloat(widthInput.value);
        const D = parseFloat(depthInput.value);
        const price = parseFloat(priceInput.value) || 0;
        const density = parseFloat(densityInput.value) || 145; // Default 145 lbs/cu ft
        const waste = parseFloat(wasteInput.value) || 0.05; // Default 5%

        if (!L || !W || !D) {
            alert("Please enter Length, Width, and Thickness.");
            return;
        }

        // 1. Convert Dimensions to Feet
        let feetL = L;
        if (lUnit.value === 'm') feetL = L * 3.28084;
        if (lUnit.value === 'yd') feetL = L * 3;

        let feetW = W;
        if (wUnit.value === 'm') feetW = W * 3.28084;
        if (wUnit.value === 'yd') feetW = W * 3;

        // 2. Convert Depth to Feet (from Inches or CM)
        let feetD = D;
        if (dUnit.value === 'in') feetD = D / 12;
        if (dUnit.value === 'cm') feetD = (D / 30.48);

        // 3. Calculate Area & Volume
        const areaSqFt = feetL * feetW;
        const volumeCuFt = areaSqFt * feetD;

        // 4. Calculate Weight (including Compaction & Waste)
        // Standard compaction factor ~1.15 is implied by ordering loose mix for compacted target
        // But simpler logic: Vol * Density = Lbs. Then add Waste.
        // NOTE: Asphalt density 145 lbs/cf is usually for COMPACTED mix.
        // So we calculate required compacted weight directly.
        
        const totalLbs = volumeCuFt * density;
        const totalTons = totalLbs / 2000;
        
        // Add Waste/Safety Margin
        const finalTons = totalTons * (1 + waste);

        // 5. Calculate Cost
        const totalCost = finalTons * price;

        // 6. Display Results
        resTons.textContent = finalTons.toFixed(2);
        resArea.textContent = areaSqFt.toFixed(0);
        resVol.textContent = volumeCuFt.toFixed(1);

        if (price > 0) {
            resCost.textContent = totalCost.toFixed(2);
            costDiv.style.display = 'block';
        } else {
            costDiv.style.display = 'none';
        }

        resultBox.classList.add('visible');
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // Clear Logic
    btnClear.addEventListener('click', () => {
        lengthInput.value = '';
        widthInput.value = '';
        depthInput.value = '';
        priceInput.value = '';
        resultBox.classList.remove('visible');
        advSection.classList.remove('show');
        toggleAdv.textContent = "Show Advanced Settings (Cost & Density) ▼";
    });

});
