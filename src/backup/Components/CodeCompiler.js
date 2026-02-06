export default async ({ code = "", input = "", language }) => {

    // console.log(language);

    if (!language) return {
        error: "invalid_language",
        errorMsg: "No programming language specified."
    };
    if(!code) return {
        error: "no_code",
        errorMsg: "No source code provided."
    };
        
    let lang_id = 54;

    switch (language.toLowerCase()) {
        case "c":
            lang_id = 50;
            break;
        case "c++":
            lang_id = 54;
            break;
        case "java":
            lang_id = 62;
            break;
        case "php":
            lang_id = 68;
            break;
        default:
            lang_id = 54;
    }

    const body = {
        source_code: btoa(code),
        stdin: input ? btoa(input) : null,
        language_id: lang_id
    };

    const response = await fetch(
        "https://ce.judge0.com/submissions?base64_encoded=true&wait=true",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        }
    );

    const data = await response.json();

    if (data.compile_output) {
        return {
            error: "compile",
            errorMsg: atob(data.compile_output)
        };
    }

    if (data.stderr) {
        return {
            error: "runtime",
            errorMsg: atob(data.stderr)
        };
    }

    if (data.message) {
        return {
            error: "judge",
            errorMsg: data.message
        };
    }

    if (data.status && data.status.description !== "Accepted") {
        return {
            error: "status",
            errorMsg: data.status.description
        };
    }

    return {
        error: null,
        output: data.stdout ? atob(data.stdout) : ""
    };
};



/**
 * @example CodeCompiler
 * @description This function compiles and runs C++ code using the Judge0 API. It takes the source code and input as parameters and returns the output, compilation errors, or runtime errors.
 * @param {Object} params - The parameters for the code compilation.
 * @param {string} params.code - The C++ source code to be compiled and executed.
 * @param {string} params.input - The input to be provided to the program during execution.
 * @return {Promise<string>} - A promise that resolves to the output of the program, compilation errors, or runtime errors.
 * @example
  const res = await CodeCompiler({
      code: `#include <iostream>
      using namespace std;

      int main() {
          int n;
          cin >> n;
          cout << "You entered: " << n << endl;
          return 0;
      }`,
      input: "45"
  });
//   console.log(res); // Output: You entered: 45
 */

