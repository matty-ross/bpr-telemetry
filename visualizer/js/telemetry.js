const BOUNDARY_LEFT = -4159;
const BOUNDARY_RIGHT = 6055;
const BOUNDARY_TOP = -5688;
const BOUNDARY_BOTTOM = 3680;


const mapBackgroundImage = new Image();
mapBackgroundImage.src = 'img/map.png';

const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvasContext.drawImage(mapBackgroundImage, 0, 0, canvas.width, canvas.height);


function drawMarker(x, y, z) {
    const MARKER_SIZE = 10;
    
    const { canvasX, canvasY } = worldToCanvas(x, z);

    canvasContext.fillStyle = 'red';
    canvasContext.fillRect(
        canvasX - MARKER_SIZE / 2,
        canvasY - MARKER_SIZE / 2,
        MARKER_SIZE,
        MARKER_SIZE
    );
}

function worldToCanvas(x, z) {
    const normalizedX = (x - BOUNDARY_LEFT) / (BOUNDARY_RIGHT - BOUNDARY_LEFT);
    const normalizedZ = (z - BOUNDARY_TOP) / (BOUNDARY_BOTTOM - BOUNDARY_TOP);

    return {
        canvasX: normalizedX * canvas.width,
        canvasY: normalizedZ * canvas.height,
    };
}

// test data
drawMarker(3089.859, -0.768, -2080.323);
drawMarker(3090.523, -0.618, -2079.457);
drawMarker(3090.711, -0.577, -2079.211);
drawMarker(3090.890, -0.537, -2078.965);
drawMarker(3091.070, -0.497, -2078.718);
drawMarker(3114.382, 1.495, -2055.344);
drawMarker(3123.297, 1.077, -2046.739);
drawMarker(3130.887, -0.204, -2039.491);
drawMarker(3149.203, -3.124, -2023.496);
drawMarker(3153.650, -3.059, -2010.939);
drawMarker(3152.738, -3.441, -2003.586);
drawMarker(3157.409, -3.422, -1995.151);
drawMarker(3170.842, -3.401, -1992.159);
drawMarker(3189.365, -3.325, -1983.245);
drawMarker(3205.262, -3.166, -1963.076);
drawMarker(3195.920, -3.443, -1939.236);
drawMarker(3170.393, -3.342, -1941.677);
drawMarker(3155.883, -3.165, -1941.745);
drawMarker(3132.030, -2.877, -1942.141);
drawMarker(3090.716, -2.547, -1934.430);
drawMarker(3056.824, -1.783, -1900.178);
drawMarker(3044.008, -0.862, -1847.880);
drawMarker(3034.844, 0.354, -1789.069);
drawMarker(3063.131, 0.813, -1737.111);
drawMarker(3119.659, 0.960, -1703.665);
drawMarker(3167.457, 12.162, -1672.020);
drawMarker(3215.607, 0.847, -1640.295);
drawMarker(3272.862, 0.698, -1603.917);
drawMarker(3342.419, 0.827, -1610.451);
drawMarker(3373.723, 0.826, -1658.150);
drawMarker(3351.849, 0.421, -1705.352);
drawMarker(3338.964, -0.141, -1730.276);
drawMarker(3321.320, -1.344, -1775.916);
drawMarker(3300.147, -2.552, -1830.520);
drawMarker(3269.429, -3.211, -1886.356);
drawMarker(3214.800, -3.238, -1924.369);
drawMarker(3146.163, -3.135, -1931.290);
drawMarker(3073.106, -2.083, -1921.379);
drawMarker(3020.782, -3.231, -1965.045);
drawMarker(3029.695, -4.463, -2037.376);
drawMarker(3013.738, -4.385, -2109.804);
drawMarker(2948.513, -4.250, -2144.089);
drawMarker(2892.109, -4.147, -2100.744);
drawMarker(2868.125, -2.662, -2025.718);
drawMarker(2829.712, -1.699, -1955.613);
drawMarker(2769.589, 0.115, -1897.604);
drawMarker(2715.883, 0.517, -1839.470);
drawMarker(2679.526, 0.599, -1775.139);
drawMarker(2696.385, 0.776, -1699.904);
drawMarker(2706.861, 0.636, -1620.324);
drawMarker(2768.442, 1.347, -1578.581);
drawMarker(2845.402, 1.938, -1598.344);
drawMarker(2913.128, 1.872, -1645.246);
drawMarker(2983.734, 0.554, -1694.205);
drawMarker(3016.518, 0.798, -1773.504);
drawMarker(3018.213, -1.045, -1862.811);
drawMarker(3009.033, -2.633, -1949.189);
drawMarker(2986.933, -2.847, -2011.418);
drawMarker(2986.933, -2.846, -2011.418);
drawMarker(2986.933, -2.846, -2011.418);
drawMarker(2986.933, -2.846, -2011.418);
drawMarker(2986.933, -2.846, -2011.418);
drawMarker(2986.933, -2.846, -2011.418);
drawMarker(2978.937, 1.516, -2011.699);
drawMarker(2978.885, 1.482, -2011.897);
drawMarker(3007.979, -2.222, -1968.208);
drawMarker(3007.988, -2.230, -1968.251);
drawMarker(3008.053, -2.398, -1972.170);
drawMarker(3009.399, -3.302, -1986.781);
drawMarker(3020.063, -3.581, -2007.438);
drawMarker(3028.943, -3.875, -2051.755);
drawMarker(3035.819, -3.980, -2107.880);
drawMarker(3007.906, -4.038, -2153.021);
drawMarker(2952.190, -3.983, -2164.860);
drawMarker(2888.834, -3.908, -2180.841);
drawMarker(2816.897, -3.847, -2190.804);
drawMarker(2747.686, -8.023, -2223.989);
drawMarker(2688.942, -8.092, -2275.137);
drawMarker(2618.452, -8.364, -2321.042);
drawMarker(2531.827, -8.289, -2340.440);
drawMarker(2443.302, -6.554, -2334.992);
drawMarker(2389.229, -8.521, -2330.411);
drawMarker(2364.248, -8.436, -2328.877);
drawMarker(2357.002, -6.470, -2328.498);
drawMarker(2357.047, -8.737, -2328.832);
drawMarker(2357.067, -8.694, -2328.792);
drawMarker(2562.167, -8.762, -2343.140);
drawMarker(2526.071, -8.044, -2343.863);
drawMarker(2471.187, -3.243, -2344.344);
drawMarker(2415.926, -8.756, -2343.015);
drawMarker(2361.385, -8.868, -2344.746);
drawMarker(2301.696, -8.843, -2351.574);
drawMarker(2243.434, -8.362, -2351.475);
drawMarker(2193.822, 0.349, -2371.004);
drawMarker(2147.792, -3.542, -2395.875);
drawMarker(2105.741, -2.843, -2425.138);
drawMarker(2078.046, -3.540, -2441.616);
drawMarker(2064.368, -3.818, -2444.789);
drawMarker(2057.915, -3.662, -2446.131);
drawMarker(2056.373, -3.814, -2447.455);
drawMarker(2056.315, -3.791, -2447.514);
drawMarker(2255.566, -8.583, -2353.021);
drawMarker(2241.369, -8.310, -2351.997);
drawMarker(2247.297, -8.441, -2350.462);
drawMarker(2263.916, -8.701, -2351.562);
drawMarker(2291.445, -8.675, -2349.548);
drawMarker(2344.689, -8.567, -2345.490);
drawMarker(2407.552, -8.751, -2341.765);
drawMarker(2471.239, -3.799, -2339.710);
drawMarker(2527.405, 4.764, -2339.122);
drawMarker(2583.235, -8.880, -2339.486);
drawMarker(2630.801, -8.272, -2307.207);
drawMarker(2648.895, -7.488, -2293.252);
drawMarker(2660.347, -7.206, -2286.514);
drawMarker(2668.265, -7.250, -2282.184);
drawMarker(2680.668, -5.531, -2276.392);
drawMarker(2685.826, -6.680, -2276.732);
drawMarker(2686.329, -8.105, -2276.687);
drawMarker(2687.253, -7.933, -2275.241);
drawMarker(2687.565, -8.126, -2274.990);
drawMarker(2687.933, -8.089, -2275.250);
drawMarker(2696.465, -8.053, -2267.843);
drawMarker(2715.316, -8.024, -2251.840);
drawMarker(2742.745, -8.016, -2229.355);
drawMarker(2781.474, -7.859, -2205.529);
drawMarker(2826.927, -0.779, -2191.778);
drawMarker(2876.560, -3.842, -2182.926);
drawMarker(2931.425, -3.983, -2160.533);
drawMarker(2994.978, -3.971, -2137.547);
drawMarker(3038.908, -4.148, -2078.952);
drawMarker(3053.662, -3.549, -1998.520);
drawMarker(3037.014, -2.145, -1920.720);
drawMarker(3004.852, -1.584, -1907.617);
drawMarker(3007.338, -1.965, -1923.205);
drawMarker(3008.182, -2.171, -1948.262);
drawMarker(2986.911, -2.504, -2011.442);
drawMarker(2986.909, -2.498, -2011.444);
drawMarker(2986.909, -2.498, -2011.444);
drawMarker(2986.909, -2.498, -2011.444);
drawMarker(2986.909, -2.498, -2011.444);
drawMarker(2986.909, -2.498, -2011.444);
drawMarker(2986.909, -2.498, -2011.444);
drawMarker(2986.909, -2.498, -2011.444);
drawMarker(2978.937, 1.516, -2011.699);
drawMarker(2978.879, -2.882, -2011.693);
drawMarker(3007.972, -2.579, -1968.204);
drawMarker(3007.972, -2.579, -1968.230);
drawMarker(3007.972, -2.580, -1968.289);
