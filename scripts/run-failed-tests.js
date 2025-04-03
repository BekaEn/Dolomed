const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const xml2js = require('xml2js');

async function runFailedTests() {
    try {
        // Read the junit results file
        const resultsPath = path.join(process.cwd(), 'test-results', 'junit-results.xml');
        if (!fs.existsSync(resultsPath)) {
            console.error('No junit-results.xml file found. Please run the tests first.');
            process.exit(1);
        }

        const parser = new xml2js.Parser();
        const xml = fs.readFileSync(resultsPath, 'utf8');
        const result = await parser.parseStringPromise(xml);

        // Get all failed tests
        const failedTests = [];
        result.testsuites.testsuite.forEach(suite => {
            if (suite.$.failures > 0) {
                suite.testcase.forEach(test => {
                    if (test.failure) {
                        failedTests.push({
                            file: suite.$.name,
                            test: test.$.name
                        });
                    }
                });
            }
        });

        if (failedTests.length === 0) {
            console.log('No failed tests found in the last run.');
            process.exit(0);
        }

        // Group tests by file
        const testsByFile = {};
        failedTests.forEach(({ file, test }) => {
            if (!testsByFile[file]) {
                testsByFile[file] = [];
            }
            testsByFile[file].push(test);
        });

        // Run tests for each file
        for (const [file, tests] of Object.entries(testsByFile)) {
            console.log(`\nRunning failed tests in ${file}...`);
            const testPattern = tests.map(test => `"${test}"`).join('|');
            try {
                execSync(`npx playwright test ${file} --grep "${testPattern}"`, { stdio: 'inherit' });
            } catch (error) {
                console.error(`Error running tests in ${file}:`, error.message);
                // Continue with next file even if one fails
            }
        }
    } catch (error) {
        console.error('Error running failed tests:', error.message);
        process.exit(1);
    }
}

runFailedTests(); 