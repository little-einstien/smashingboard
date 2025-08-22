const fs = require('fs');
const path = require('path');

// File size analysis for SVG optimization
function analyzeFileSize() {
    const svgPath = 'app/components/BabyKeyboardLogo.svg';
    
    try {
        const stats = fs.statSync(svgPath);
        const fileSizeInBytes = stats.size;
        const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2);
        
        console.log('=== SVG File Size Analysis ===');
        console.log(`File: ${svgPath}`);
        console.log(`Size: ${fileSizeInBytes} bytes (${fileSizeInKB} KB)`);
        
        // Read and analyze content
        const content = fs.readFileSync(svgPath, 'utf8');
        
        // Count different elements
        const elementCounts = {
            gradients: (content.match(/<linearGradient|<radialGradient/g) || []).length,
            paths: (content.match(/<path/g) || []).length,
            circles: (content.match(/<circle/g) || []).length,
            rectangles: (content.match(/<rect/g) || []).length,
            ellipses: (content.match(/<ellipse/g) || []).length,
            text: (content.match(/<text/g) || []).length,
            groups: (content.match(/<g/g) || []).length,
            polygons: (content.match(/<polygon/g) || []).length,
            lines: (content.match(/<line/g) || []).length
        };
        
        console.log('\n=== Element Analysis ===');
        Object.entries(elementCounts).forEach(([element, count]) => {
            console.log(`${element}: ${count}`);
        });
        
        // Check for optimization opportunities
        console.log('\n=== Optimization Analysis ===');
        
        // Check for unnecessary whitespace
        const hasExcessiveWhitespace = content.includes('  ') || content.includes('\n\n');
        console.log(`Excessive whitespace: ${hasExcessiveWhitespace ? 'Yes - could be optimized' : 'No'}`);
        
        // Check for inline styles vs CSS
        const hasInlineStyles = content.includes('style=');
        const hasCSSStyles = content.includes('<style>');
        console.log(`Inline styles: ${hasInlineStyles ? 'Yes' : 'No'}`);
        console.log(`CSS styles: ${hasCSSStyles ? 'Yes' : 'No'}`);
        
        // Check for comments
        const hasComments = content.includes('<!--');
        console.log(`Comments: ${hasComments ? 'Yes' : 'No'}`);
        
        // Check for CDATA sections
        const hasCDATA = content.includes('<![CDATA[');
        console.log(`CDATA sections: ${hasCDATA ? 'Yes' : 'No'}`);
        
        // Estimate compressed size (rough approximation)
        const estimatedGzipSize = Math.round(fileSizeInBytes * 0.3); // Rough estimate
        console.log(`Estimated gzipped size: ~${estimatedGzipSize} bytes (~${(estimatedGzipSize/1024).toFixed(2)} KB)`);
        
        // Web optimization recommendations
        console.log('\n=== Web Optimization Status ===');
        if (fileSizeInKB < 20) {
            console.log('✓ File size is excellent for web use (< 20KB)');
        } else if (fileSizeInKB < 50) {
            console.log('✓ File size is good for web use (< 50KB)');
        } else {
            console.log('⚠ File size may be large for web use (> 50KB)');
        }
        
        // Check for accessibility features
        const hasTitle = content.includes('<title');
        const hasDesc = content.includes('<desc');
        const hasAriaLabels = content.includes('aria-label');
        const hasRole = content.includes('role=');
        
        console.log('\n=== Accessibility Features ===');
        console.log(`Title element: ${hasTitle ? '✓' : '✗'}`);
        console.log(`Description element: ${hasDesc ? '✓' : '✗'}`);
        console.log(`ARIA labels: ${hasAriaLabels ? '✓' : '✗'}`);
        console.log(`Role attribute: ${hasRole ? '✓' : '✗'}`);
        
        return {
            sizeBytes: fileSizeInBytes,
            sizeKB: parseFloat(fileSizeInKB),
            elements: elementCounts,
            optimized: fileSizeInKB < 20,
            accessible: hasTitle && hasDesc && hasAriaLabels
        };
        
    } catch (error) {
        console.error('Error analyzing file:', error.message);
        return null;
    }
}

// Run analysis
const results = analyzeFileSize();

if (results) {
    console.log('\n=== Summary ===');
    console.log(`File size: ${results.sizeKB} KB`);
    console.log(`Web optimized: ${results.optimized ? 'Yes' : 'No'}`);
    console.log(`Accessible: ${results.accessible ? 'Yes' : 'No'}`);
    console.log(`Total elements: ${Object.values(results.elements).reduce((a, b) => a + b, 0)}`);
}