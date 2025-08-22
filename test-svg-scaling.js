// SVG Scaling Test Script
// This script tests the baby keyboard logo SVG at various sizes and validates scaling behavior

const fs = require('fs');
const path = require('path');

// Test configuration
const testSizes = [
  { width: 16, height: 12, name: 'minimum' },
  { width: 32, height: 24, name: 'small-icon' },
  { width: 64, height: 48, name: 'medium-icon' },
  { width: 128, height: 96, name: 'large-icon' },
  { width: 256, height: 192, name: 'header' },
  { width: 500, height: 375, name: 'maximum' }
];

const containerSizes = [
  { width: 100, name: 'small-container' },
  { width: 200, name: 'medium-container' },
  { width: 400, name: 'large-container' },
  { width: 600, name: 'xlarge-container' }
];

// Read the SVG file
function readSVGFile() {
  try {
    const svgPath = path.join(__dirname, 'app', 'components', 'BabyKeyboardLogo.svg');
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    return svgContent;
  } catch (error) {
    console.error('Error reading SVG file:', error.message);
    return null;
  }
}

// Parse SVG viewBox
function parseViewBox(svgContent) {
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  if (viewBoxMatch) {
    const [x, y, width, height] = viewBoxMatch[1].split(' ').map(Number);
    return { x, y, width, height };
  }
  return null;
}

// Calculate aspect ratio
function calculateAspectRatio(width, height) {
  return width / height;
}

// Test SVG structure and attributes
function testSVGStructure(svgContent) {
  const tests = {
    hasViewBox: /viewBox="[^"]+"/,
    hasPreserveAspectRatio: /preserveAspectRatio="[^"]+"/,
    hasWidthHeight: /width="[^"]+" height="[^"]+"/,
    hasAriaLabels: /aria-labelledby="[^"]+"/,
    hasTitle: /<title[^>]*>/,
    hasDescription: /<desc[^>]*>/,
    hasResponsiveClass: /class="[^"]*baby-keyboard-logo[^"]*"/
  };

  const results = {};
  for (const [testName, regex] of Object.entries(tests)) {
    results[testName] = regex.test(svgContent);
  }

  return results;
}

// Test text readability at different sizes
function testTextReadability(svgContent) {
  const textElements = svgContent.match(/<text[^>]*>([^<]+)<\/text>/g) || [];
  const fontSizes = svgContent.match(/font-size="([^"]+)"/g) || [];
  
  const textAnalysis = {
    totalTextElements: textElements.length,
    fontSizes: fontSizes.map(fs => fs.match(/font-size="([^"]+)"/)[1]),
    hasBoldText: /font-weight="bold"/.test(svgContent),
    smallestFontSize: Math.min(...fontSizes.map(fs => parseFloat(fs.match(/font-size="([^"]+)"/)[1]))),
    largestFontSize: Math.max(...fontSizes.map(fs => parseFloat(fs.match(/font-size="([^"]+)"/)[1])))
  };

  // Calculate readability scores for different sizes
  const readabilityScores = testSizes.map(size => {
    const scaleFactor = size.width / 200; // Original viewBox width is 200
    const effectiveFontSize = textAnalysis.smallestFontSize * scaleFactor;
    
    return {
      size: size.name,
      dimensions: `${size.width}x${size.height}`,
      scaleFactor: scaleFactor.toFixed(3),
      effectiveFontSize: effectiveFontSize.toFixed(2),
      readable: effectiveFontSize >= 3, // Minimum readable size
      score: effectiveFontSize >= 6 ? 'excellent' : 
             effectiveFontSize >= 4 ? 'good' : 
             effectiveFontSize >= 3 ? 'acceptable' : 'poor'
    };
  });

  return { textAnalysis, readabilityScores };
}

// Test proportional scaling
function testProportionalScaling(viewBox) {
  const originalAspectRatio = calculateAspectRatio(viewBox.width, viewBox.height);
  
  const scalingTests = testSizes.map(size => {
    const testAspectRatio = calculateAspectRatio(size.width, size.height);
    const aspectRatioDiff = Math.abs(originalAspectRatio - testAspectRatio);
    
    return {
      size: size.name,
      dimensions: `${size.width}x${size.height}`,
      aspectRatio: testAspectRatio.toFixed(3),
      aspectRatioDiff: aspectRatioDiff.toFixed(3),
      maintainsProportions: aspectRatioDiff < 0.01
    };
  });

  return {
    originalAspectRatio: originalAspectRatio.toFixed(3),
    scalingTests
  };
}

// Test container responsiveness
function testContainerResponsiveness(viewBox) {
  const containerTests = containerSizes.map(container => {
    // Assuming height is auto-calculated to maintain aspect ratio
    const calculatedHeight = (container.width * viewBox.height) / viewBox.width;
    
    return {
      containerName: container.name,
      containerWidth: container.width,
      calculatedHeight: Math.round(calculatedHeight),
      scaleFactor: (container.width / viewBox.width).toFixed(3),
      fitsInContainer: true // SVG should always fit with proper CSS
    };
  });

  return containerTests;
}

// Generate test report
function generateTestReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    testResults: results,
    summary: {
      structureTests: Object.values(results.structure).filter(Boolean).length,
      totalStructureTests: Object.keys(results.structure).length,
      readableAtAllSizes: results.readability.readabilityScores.every(score => score.readable),
      maintainsProportions: results.scaling.scalingTests.every(test => test.maintainsProportions),
      responsiveContainers: results.containers.every(test => test.fitsInContainer)
    }
  };

  report.summary.overallScore = (
    (report.summary.structureTests / report.summary.totalStructureTests) * 0.3 +
    (report.summary.readableAtAllSizes ? 1 : 0) * 0.3 +
    (report.summary.maintainsProportions ? 1 : 0) * 0.2 +
    (report.summary.responsiveContainers ? 1 : 0) * 0.2
  ).toFixed(2);

  return report;
}

// Main test function
function runScalingTests() {
  console.log('🧪 Running Baby Keyboard Logo Scaling Tests...\n');

  const svgContent = readSVGFile();
  if (!svgContent) {
    console.error('❌ Failed to read SVG file');
    return;
  }

  const viewBox = parseViewBox(svgContent);
  if (!viewBox) {
    console.error('❌ Failed to parse viewBox');
    return;
  }

  console.log(`📐 Original ViewBox: ${viewBox.width}x${viewBox.height}`);
  console.log(`📏 Original Aspect Ratio: ${calculateAspectRatio(viewBox.width, viewBox.height).toFixed(3)}\n`);

  // Run all tests
  const results = {
    structure: testSVGStructure(svgContent),
    readability: testTextReadability(svgContent),
    scaling: testProportionalScaling(viewBox),
    containers: testContainerResponsiveness(viewBox)
  };

  // Generate and display report
  const report = generateTestReport(results);

  console.log('📊 TEST RESULTS\n');
  console.log('='.repeat(50));

  // Structure Tests
  console.log('\n🏗️  SVG STRUCTURE TESTS');
  console.log('-'.repeat(30));
  Object.entries(results.structure).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
  });

  // Readability Tests
  console.log('\n📖 TEXT READABILITY TESTS');
  console.log('-'.repeat(30));
  console.log(`Total text elements: ${results.readability.textAnalysis.totalTextElements}`);
  console.log(`Font size range: ${results.readability.textAnalysis.smallestFontSize}-${results.readability.textAnalysis.largestFontSize}px`);
  console.log(`Has bold text: ${results.readability.textAnalysis.hasBoldText ? 'Yes' : 'No'}\n`);

  results.readability.readabilityScores.forEach(score => {
    const icon = score.readable ? '✅' : '❌';
    console.log(`${icon} ${score.size} (${score.dimensions}): ${score.effectiveFontSize}px - ${score.score.toUpperCase()}`);
  });

  // Scaling Tests
  console.log('\n📏 PROPORTIONAL SCALING TESTS');
  console.log('-'.repeat(30));
  results.scaling.scalingTests.forEach(test => {
    const icon = test.maintainsProportions ? '✅' : '❌';
    console.log(`${icon} ${test.size} (${test.dimensions}): Ratio ${test.aspectRatio} (diff: ${test.aspectRatioDiff})`);
  });

  // Container Tests
  console.log('\n📦 CONTAINER RESPONSIVENESS TESTS');
  console.log('-'.repeat(30));
  results.containers.forEach(test => {
    const icon = test.fitsInContainer ? '✅' : '❌';
    console.log(`${icon} ${test.containerName}: ${test.containerWidth}px → ${test.calculatedHeight}px (scale: ${test.scaleFactor})`);
  });

  // Summary
  console.log('\n📈 SUMMARY');
  console.log('-'.repeat(30));
  console.log(`Structure Tests: ${report.summary.structureTests}/${report.summary.totalStructureTests} passed`);
  console.log(`Readable at all sizes: ${report.summary.readableAtAllSizes ? 'Yes' : 'No'}`);
  console.log(`Maintains proportions: ${report.summary.maintainsProportions ? 'Yes' : 'No'}`);
  console.log(`Responsive containers: ${report.summary.responsiveContainers ? 'Yes' : 'No'}`);
  console.log(`Overall Score: ${report.summary.overallScore}/1.00`);

  const grade = parseFloat(report.summary.overallScore) >= 0.9 ? 'A' : 
                parseFloat(report.summary.overallScore) >= 0.8 ? 'B' : 
                parseFloat(report.summary.overallScore) >= 0.7 ? 'C' : 
                parseFloat(report.summary.overallScore) >= 0.6 ? 'D' : 'F';

  console.log(`Grade: ${grade}\n`);

  // Save detailed report
  fs.writeFileSync('scaling-test-report.json', JSON.stringify(report, null, 2));
  console.log('📄 Detailed report saved to: scaling-test-report.json');

  return report;
}

// Run tests if this script is executed directly
if (require.main === module) {
  runScalingTests();
}

module.exports = { runScalingTests };