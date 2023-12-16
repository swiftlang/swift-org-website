---
layout: page
title: Issue 305
---

This is a temporary page to test and solve #305

### C++

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;

    // Single-line comment

    /*
    Multi-line comment
    */

    // Variables
    int number = 42;
    double pi = 3.14159;

    // Control flow
    if (number > 0) {
        std::cout << "Positive number" << std::endl;
    } else {
        std::cout << "Non-positive number" << std::endl;
    }

    // Function
    auto add = [](int a, int b) {
        return a + b;
    };

    // Objects and classes
    class MyClass {
    public:
        void display() {
            std::cout << "Inside MyClass" << std::endl;
        }
    };

    // Object instantiation
    MyClass myClass;

    // Method call
    myClass.display();

    // Array
    int array[] = {1, 2, 3, 4, 5};

    // Loop
    for (int i = 0; i < 5; i++) {
        std::cout << array[i] << std::endl;
    }

    // Return
    return 0;
}
```

### Swift

```swift
import Foundation

func main() {
    print("Hello, World!")

    // Single-line comment

    /*
    Multi-line comment
    */

    // Variables
    let number = 42
    let pi = 3.14159

    // Control flow
    if number > 0 {
        print("Positive number")
    } else {
        print("Non-positive number")
    }

    // Function
    let add: (Int, Int) -> Int = { a, b in
        return a + b
    }

    // Objects and classes
    class MyClass {
        func display() {
            print("Inside MyClass")
        }
    }

    // Object instantiation
    let myClass = MyClass()

    // Method call
    myClass.display()

    // Array
    let array = [1, 2, 3, 4, 5]

    // Loop
    for element in array {
        print(element)
    }
}

main()

// Return
exit(0)
```

### JavaScript

```js
function main() {
  console.log("Hello, World!");

  // Single-line comment

  /*
    Multi-line comment
    */

  // Variables
  let number = 42;
  let pi = 3.14159;

  // Control flow
  if (number > 0) {
    console.log("Positive number");
  } else {
    console.log("Non-positive number");
  }

  // Function
  let add = function (a, b) {
    return a + b;
  };

  // Objects and classes
  class MyClass {
    display() {
      console.log("Inside MyClass");
    }
  }

  // Object instantiation
  let myClass = new MyClass();

  // Method call
  myClass.display();

  // Array
  let array = [1, 2, 3, 4, 5];

  // Loop
  for (let i = 0; i < array.length; i++) {
    console.log(array[i]);
  }
}
main();
```
