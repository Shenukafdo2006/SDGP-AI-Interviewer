import "./Quiz.css";
import React, { useState, useMemo, useEffect } from "react";

const quizzes = [
  {
    id: 1,
    title: "JavaScript ",
    description: "Core JavaScript Concepts",
    difficulty: "Beginner",
    questions: [
      { q: "What is a closure?", a: ["Function with preserved scope", "CSS property", "Loop", "Object"], correct: 0 },
      { q: "Which declares a variable?", a: ["var", "let", "const", "All"], correct: 3 },
      { q: "=== means?", a: ["Equal value", "Equal value & type", "Assign", "Compare"], correct: 1 },
      { q: "Convert JSON to object?", a: ["JSON.parse()", "JSON.stringify()", "JSON.toObj()", "JSON.convert()"], correct: 0 },
      { q: "Add element to end?", a: ["push()", "pop()", "shift()", "unshift()"], correct: 0 },
      { q: "Remove last element?", a: ["pop()", "push()", "shift()", "delete()"], correct: 0 },
      { q: "typeof null?", a: ["null", "object", "undefined", "string"], correct: 1 },
      { q: "Loop runs at least once?", a: ["for", "while", "do...while", "foreach"], correct: 2 },
      { q: "Single line comment?", a: ["//", "/* */", "#", "<!-- -->"], correct: 0 },
      { q: "Async handling keyword?", a: ["async/await", "delay", "wait()", "promiseOnly"], correct: 0 },
    ],
  },
    {
    id: 2,
    title: "Java",
    description: "Core Java Concepts",
    difficulty: "Beginner",
    questions: [
      { q: "Which keyword is used to create a class?", a: ["class", "struct", "function", "object"], correct: 0 },
      { q: "Java is ___ language?", a: ["Compiled", "Interpreted", "Both", "None"], correct: 2 },
      { q: "Which method starts execution?", a: ["start()", "main()", "run()", "execute()"], correct: 1 },
      { q: "Primitive type for decimal?", a: ["int", "double", "String", "float"], correct: 1 },
      { q: "Inheritance keyword?", a: ["extend", "extends", "implements", "inherit"], correct: 1 },
      { q: "Java supports multiple inheritance via?", a: ["Class", "Interface", "Abstract", "Package"], correct: 1 },
      { q: "Access modifier for everything?", a: ["private", "public", "protected", "default"], correct: 1 },
      { q: "Default value of boolean?", a: ["true", "false", "0", "null"], correct: 1 },
      { q: "Loop until condition false?", a: ["for", "while", "do...while", "loop"], correct: 1 },
      { q: "Keyword for exception handling?", a: ["try", "catch", "throw", "All"], correct: 3 },
    ],
  },
  {
    id: 3,
    title: "HTML ",
    description: "Core HTML Concepts",
    difficulty: "Beginner",
    questions: [
      { q: "HTML stands for?", a: ["HyperText Markup Language", "HighText ML", "Home Tool ML", "Hyperlinks ML"], correct: 0 },
      { q: "Hyperlink tag?", a: ["<a>", "<link>", "<href>", "<h1>"], correct: 0 },
      { q: "Image tag?", a: ["<img>", "<image>", "<src>", "<pic>"], correct: 0 },
      { q: "Largest heading?", a: ["<h6>", "<h1>", "<head>", "<title>"], correct: 1 },
      { q: "Paragraph tag?", a: ["<para>", "<p>", "<text>", "<pg>"], correct: 1 },
      { q: "Line break tag?", a: ["<br>", "<lb>", "<break>", "<hr>"], correct: 0 },
      { q: "Table row?", a: ["<td>", "<tr>", "<th>", "<table>"], correct: 1 },
      { q: "List tag?", a: ["<ul>", "<li>", "<ol>", "All"], correct: 3 },
      { q: "Meta tag inside?", a: ["body", "footer", "head", "title"], correct: 2 },
      { q: "Form tag?", a: ["<form>", "<input>", "<label>", "<submit>"], correct: 0 },
    ],
  },
  {
    id: 4,
    title: "Python",
    description: "Core Python Concepts",
    difficulty: "Beginner",
    questions: [
      { q: "Python is ___ typed language?", a: ["Strongly", "Weakly", "Both", "None"], correct: 0 },
      { q: "Function keyword?", a: ["def", "func", "function", "define"], correct: 0 },
      { q: "Print to console?", a: ["print()", "console.log()", "echo()", "write()"], correct: 0 },
      { q: "List indexing starts at?", a: ["0", "1", "-1", "None"], correct: 0 },
      { q: "Python file extension?", a: [".java", ".py", ".js", ".txt"], correct: 1 },
      { q: "Loop over sequence?", a: ["for", "while", "loop", "foreach"], correct: 0 },
      { q: "Python comment?", a: ["//", "#", "/* */", "<!-- -->"], correct: 1 },
      { q: "Dictionary key-value syntax?", a: ["{}", "[]", "()", "<>"], correct: 0 },
      { q: "Boolean True value?", a: ["True", "true", "1", "Yes"], correct: 0 },
      { q: "Exit from loop?", a: ["break", "stop", "exit", "end"], correct: 0 },
    ],
  }, 
   {
    id: 5,
    title: "OOP",
    description: "Object Oriented Programming Concepts",
    difficulty: "Beginner",
    questions: [
      { q: "OOP stands for?", a: ["Object Oriented Programming", "Open Oriented Program", "Object Ordered Program", "None"], correct: 0 },
      { q: "Encapsulation means?", a: ["Hiding data", "Inheritance", "Polymorphism", "Abstraction"], correct: 0 },
      { q: "Inheritance allows?", a: ["Code reuse", "Data hiding", "Object creation", "Compilation"], correct: 0 },
      { q: "Polymorphism is?", a: ["Many forms", "Single form", "Variable type", "None"], correct: 0 },
      { q: "Class vs Object?", a: ["Template vs Instance", "Instance vs Template", "Function vs Variable", "None"], correct: 0 },
      { q: "Abstraction is?", a: ["Hiding implementation", "Encapsulation", "Inheritance", "Polymorphism"], correct: 0 },
      { q: "Method overriding?", a: ["Child changes parent method", "Child adds new method", "Parent method deletion", "None"], correct: 0 },
      { q: "Constructor purpose?", a: ["Initialize object", "Destroy object", "Return object", "None"], correct: 0 },
      { q: "Access specifier?", a: ["public/private/protected", "int/float/string", "if/else/for", "None"], correct: 0 },
      { q: "OOP main concept?", a: ["Encapsulation, Inheritance, Polymorphism, Abstraction", "Only Inheritance", "Only Encapsulation", "None"], correct: 0 },
    ],
  },
  
  {
    id: 6,
    title: "Algorithm",
    description: "Basic Algorithm Concepts",
    difficulty: "Beginner",
    questions: [
      { q: "Algorithm means?", a: ["Step by step procedure", "Random process", "Data storage", "Function call"], correct: 0 },
      { q: "Best case complexity?", a: ["Minimum time", "Maximum time", "Average time", "None"], correct: 0 },
      { q: "Sorting type?", a: ["Bubble, Merge, Quick", "Add, Delete, Pop", "Push, Pop, Shift", "None"], correct: 0 },
      { q: "Searching type?", a: ["Linear, Binary", "Loop, Conditional", "Add, Remove", "None"], correct: 0 },
      { q: "Complexity of linear search?", a: ["O(n)", "O(log n)", "O(n^2)", "O(1)"], correct: 0 },
      { q: "Complexity of binary search?", a: ["O(log n)", "O(n)", "O(n^2)", "O(1)"], correct: 0 },
      { q: "Algorithm efficiency depends on?", a: ["Time & Space", "Memory only", "CPU only", "None"], correct: 0 },
      { q: "Recursion is?", a: ["Function calling itself", "Loop", "Iteration", "Array"], correct: 0 },
      { q: "Divide and Conquer?", a: ["Divide problem into subproblems", "Combine arrays", "Sort data", "Loop"], correct: 0 },
      { q: "Greedy approach?", a: ["Pick best at each step", "Pick first element", "Pick last element", "Loop"], correct: 0 },
    ],
  },
   
   {
    id: 7,
    title: "CSS",
    description: "Core CSS Concepts",
    difficulty: "Beginner",
    questions: [
      { q: "CSS stands for?", a: ["Cascading Style Sheets", "Creative Style", "Color Style", "None"], correct: 0 },
      { q: "Text color property?", a: ["font-color", "color", "text-style", "fg"], correct: 1 },
      { q: "Inside spacing?", a: ["margin", "padding", "border", "space"], correct: 1 },
      { q: "Outside spacing?", a: ["margin", "padding", "gap", "border"], correct: 0 },
      { q: "Flexbox property?", a: ["display:flex", "flexbox:true", "align:flex", "box:flex"], correct: 0 },
      { q: "Center text?", a: ["align:center", "text-align:center", "center:true", "justify:center"], correct: 1 },
      { q: "Background color?", a: ["bgcolor", "background-color", "color-bg", "fill"], correct: 1 },
      { q: "Border radius?", a: ["corner", "border-radius", "round", "radius"], correct: 1 },
      { q: "Grid layout?", a: ["display:grid", "layout:grid", "grid:true", "use:grid"], correct: 0 },
      { q: "Hover effect?", a: [":hover", "::hover", ".hover", "#hover"], correct: 0 },
    ],
  },
  {
  id: 8,
  title: "React Fundamentals",
  description: "Core React Concepts for Beginners",
  difficulty: "Beginner",
  questions: [
    { q: "React is a?", a: ["Library", "Framework", "Language", "Database"], correct: 0 },
    { q: "Which hook is used to store state?", a: ["useState", "useEffect", "useRef", "useMemo"], correct: 0 },
    { q: "JSX stands for?", a: ["JavaScript XML", "Java Syntax X", "JSON XML", "Just Simple X"], correct: 0 },
    { q: "How do you pass data to a component?", a: ["Props", "State", "Hooks", "Variables"], correct: 0 },
    { q: "Which hook runs side effects?", a: ["useEffect", "useState", "useRef", "useMemo"], correct: 0 },
    { q: "A component must return?", a: ["JSX", "HTML", "CSS", "Text"], correct: 0 },
    { q: "Keys in lists help with?", a: ["Performance", "Styling", "API calls", "Routing"], correct: 0 },
    { q: "React was developed by?", a: ["Facebook", "Google", "Microsoft", "Apple"], correct: 0 },
    { q: "Fragment syntax in React is?", a: ["<>...</>", "<div>...</div>", "<frag>...</frag>", "<React>...</React>"], correct: 0 },
    { q: "React uses a virtual?", a: ["DOM", "Database", "Hook", "Component Tree"], correct: 0 },
  ],
  },
  
  {
    id: 9,
    title: "React Fundamentals",
    description: "Intermediate React Core Concepts",
    difficulty: "Intermediate",
    questions: [
      { q: "React is a?", a: ["Library", "Framework", "Language", "Database"], correct: 0 },
      { q: "Hook for state?", a: ["useEffect", "useState", "useMemo", "useRef"], correct: 1 },
      { q: "JSX stands for?", a: ["JavaScript XML", "Java Syntax X", "JSON XML", "None"], correct: 0 },
      { q: "Props are?", a: ["Data passed to components", "State", "Hooks", "CSS"], correct: 0 },
      { q: "Virtual DOM is?", a: ["Copy of real DOM", "Database", "Hook", "Server"], correct: 0 },
      { q: "Side effects hook?", a: ["useState", "useEffect", "useMemo", "useHook"], correct: 1 },
      { q: "Component must return?", a: ["HTML", "JSX", "CSS", "JSON"], correct: 1 },
      { q: "Key prop is for?", a: ["Performance", "List rendering", "Styling", "API"], correct: 1 },
      { q: "React created by?", a: ["Google", "Facebook", "Microsoft", "Amazon"], correct: 1 },
      { q: "Fragment syntax?", a: ["<> </>", "<div>", "<frag>", "<React>"], correct: 0 },
      { q: "useRef is used for?", a: ["DOM reference", "State", "Routing", "API calls"], correct: 0 },
      { q: "Which is used for routing?", a: ["React Router", "Redux", "Axios", "Bootstrap"], correct: 0 },
      { q: "State is?", a: ["Immutable", "Mutable", "CSS", "HTML"], correct: 1 },
      { q: "setState is?", a: ["Synchronous", "Asynchronous", "CSS", "Hook"], correct: 1 },
      { q: "Parent to child data flow?", a: ["Props", "State", "Hooks", "API"], correct: 0 },
      { q: "Which installs React?", a: ["npm install react", "npm get react", "install react", "node react"], correct: 0 },
      { q: "Default port React runs?", a: ["3000", "5000", "8000", "8080"], correct: 0 },
      { q: "Class component uses?", a: ["Hooks", "Lifecycle Methods", "JSX only", "API"], correct: 1 },
      { q: "React app build command?", a: ["npm run start", "npm run build", "npm build", "react build"], correct: 1 },
      { q: "Conditional rendering uses?", a: ["if / ternary", "for loop", "switch only", "CSS"], correct: 0 },
    ],
  },

  {
    id: 10,
    title: "JavaScript ",
    description: "Intermediate JavaScript Concepts",
    difficulty: "Intermediate",
    questions: [
      { q: "Which keyword creates block scope?", a: ["let", "var", "constvar", "function"], correct: 0 },
      { q: "Difference between == and === ?", a: ["Type + value", "Value only", "Type only", "None"], correct: 0 },
      { q: "What is closure?", a: ["Function with preserved scope", "Loop", "Variable", "Object"], correct: 0 },
      { q: "Arrow functions use?", a: ["=>", "->", "==>", "::"], correct: 0 },
      { q: "Which method adds item to array end?", a: ["push()", "pop()", "shift()", "slice()"], correct: 0 },
      { q: "Which method removes last item?", a: ["pop()", "push()", "shift()", "map()"], correct: 0 },
      { q: "map() returns?", a: ["New array", "Boolean", "Number", "Object"], correct: 0 },
      { q: "filter() returns?", a: ["Filtered array", "Number", "String", "Boolean"], correct: 0 },
      { q: "What is JSON?", a: ["Data format", "Function", "Loop", "Variable"], correct: 0 },
      { q: "Convert object to JSON?", a: ["JSON.stringify()", "JSON.parse()", "toJSON()", "string()"], correct: 0 },
      { q: "Convert JSON to object?", a: ["JSON.parse()", "JSON.stringify()", "parseJSON()", "toObject()"], correct: 0 },
      { q: "Promise represents?", a: ["Future value", "Loop", "Variable", "Array"], correct: 0 },
      { q: "Async function keyword?", a: ["async", "await", "promise", "defer"], correct: 0 },
      { q: "Await works with?", a: ["Promises", "Arrays", "Objects", "Loops"], correct: 0 },
      { q: "Spread operator?", a: ["...", ":::", "***", "&&&"], correct: 0 },
      { q: "Rest parameter uses?", a: ["...", "###", "$$$", "%%"], correct: 0 },
      { q: "Template strings use?", a: ["` `", "' '", "\" \"", "< >"], correct: 0 },
      { q: "Which method finds first match?", a: ["find()", "map()", "reduce()", "every()"], correct: 0 },
      { q: "reduce() returns?", a: ["Single value", "Array", "Boolean", "Object"], correct: 0 },
      { q: "typeof null returns?", a: ["object", "null", "undefined", "string"], correct: 0 }
    ],
  },
  
  {
    id: 11,
    title: "Java ",
    description: "Intermediate Java Concepts",
    difficulty: "Intermediate",
    questions: [
      { q: "Java is a?", a: ["Object Oriented Language", "Database", "Operating System", "Browser"], correct: 0 },
      { q: "Which keyword creates an object?", a: ["new", "create", "object", "make"], correct: 0 },
      { q: "Parent class is called?", a: ["Superclass", "Childclass", "Subclass", "Object"], correct: 0 },
      { q: "Child class is called?", a: ["Subclass", "Superclass", "Parent", "Root"], correct: 0 },
      { q: "Method overloading means?", a: ["Same method different parameters", "Same class", "Different classes", "Same variables"], correct: 0 },
      { q: "Method overriding requires?", a: ["Inheritance", "Loop", "Array", "Interface"], correct: 0 },
      { q: "Which access modifier is most restricted?", a: ["private", "public", "protected", "default"], correct: 0 },
      { q: "Array index starts at?", a: ["0", "1", "-1", "Depends"], correct: 0 },
      { q: "Exception handled by?", a: ["try-catch", "if-else", "loop", "switch"], correct: 0 },
      { q: "Which keyword inherits class?", a: ["extends", "implements", "inherits", "super"], correct: 0 },
      { q: "Interface uses keyword?", a: ["implements", "extends", "inherit", "interfaceuse"], correct: 0 },
      { q: "Abstract class keyword?", a: ["abstract", "virtual", "interface", "class"], correct: 0 },
      { q: "Main method signature?", a: ["public static void main(String[] args)", "main()", "void main()", "start()"], correct: 0 },
      { q: "Static keyword means?", a: ["Belongs to class", "Belongs to object", "Variable", "Constant"], correct: 0 },
      { q: "Final keyword means?", a: ["Cannot change", "Loop", "Method", "Object"], correct: 0 },
      { q: "Constructor name must be?", a: ["Same as class", "Any name", "start", "init"], correct: 0 },
      { q: "Polymorphism means?", a: ["Many forms", "One class", "One object", "Loop"], correct: 0 },
      { q: "Encapsulation means?", a: ["Data hiding", "Inheritance", "Looping", "Printing"], correct: 0 },
      { q: "Which stores multiple values?", a: ["Array", "int", "double", "char"], correct: 0 },
      { q: "Scanner class used for?", a: ["User input", "Output", "Math", "Files"], correct: 0 }
    ],
  },

  {
    id: 12,
    title: "HTML",
    description: "Intermediate HTML Concepts",
    difficulty: "Intermediate",
    questions: [
      { q: "HTML stands for?", a: ["HyperText Markup Language", "HighText Machine Language", "Hyper Tool Markup", "Home Tool Markup"], correct: 0 },
      { q: "Semantic tag example?", a: ["<article>", "<div>", "<span>", "<b>"], correct: 0 },
      { q: "Which tag defines navigation?", a: ["<nav>", "<menu>", "<link>", "<navigate>"], correct: 0 },
      { q: "Which tag embeds video?", a: ["<video>", "<media>", "<movie>", "<embedvideo>"], correct: 0 },
      { q: "Which tag embeds audio?", a: ["<audio>", "<sound>", "<music>", "<mp3>"], correct: 0 },
      { q: "Form submission method attribute?", a: ["method", "type", "actionto", "submit"], correct: 0 },
      { q: "Form data sent to?", a: ["action", "method", "target", "name"], correct: 0 },
      { q: "Required input attribute?", a: ["required", "validate", "must", "needed"], correct: 0 },
      { q: "Placeholder attribute shows?", a: ["Hint text", "Value", "Label", "Title"], correct: 0 },
      { q: "Which input type for email?", a: ["email", "mail", "textmail", "inputmail"], correct: 0 },
      { q: "Open link new tab?", a: ['target="_blank"', 'target="new"', 'newtab', 'blank'], correct: 0 },
      { q: "Image alternative text attribute?", a: ["alt", "title", "src", "text"], correct: 0 },
      { q: "Table row tag?", a: ["<tr>", "<td>", "<th>", "<table>"], correct: 0 },
      { q: "Table header tag?", a: ["<th>", "<td>", "<tr>", "<thead>"], correct: 0 },
      { q: "Grouping form elements?", a: ["<fieldset>", "<group>", "<formgroup>", "<section>"], correct: 0 },
      { q: "Dropdown list tag?", a: ["<select>", "<dropdown>", "<list>", "<optionlist>"], correct: 0 },
      { q: "Option inside dropdown?", a: ["<option>", "<item>", "<choice>", "<selectitem>"], correct: 0 },
      { q: "Meta viewport used for?", a: ["Responsive design", "SEO", "JavaScript", "Forms"], correct: 0 },
      { q: "Inline element example?", a: ["<span>", "<div>", "<section>", "<article>"], correct: 0 },
      { q: "Block element example?", a: ["<div>", "<span>", "<a>", "<b>"], correct: 0 }
    ],
  },

  {
    id: 13,
    title: "Python",
    description: "Intermediate Python Concepts",
    difficulty: "Intermediate",
    questions: [
      { q: "Python is a?", a: ["Interpreted language", "Database", "Browser", "Operating System"], correct: 0 },
      { q: "Which keyword defines function?", a: ["def", "function", "func", "method"], correct: 0 },
      { q: "List is defined using?", a: ["[]", "{}", "()", "<>"], correct: 0 },
      { q: "Dictionary uses?", a: ["{}", "[]", "()", "<>"], correct: 0 },
      { q: "Tuple uses?", a: ["()", "[]", "{}", "<>"], correct: 0 },
      { q: "Lambda is?", a: ["Anonymous function", "Loop", "Variable", "Class"], correct: 0 },
      { q: "Which handles exceptions?", a: ["try-except", "if-else", "loop", "switch"], correct: 0 },
      { q: "Which imports module?", a: ["import", "include", "require", "using"], correct: 0 },
      { q: "len() returns?", a: ["Length", "Value", "Type", "Index"], correct: 0 },
      { q: "range() used for?", a: ["Loops", "Strings", "Files", "Classes"], correct: 0 },
      { q: "Append item to list?", a: ["append()", "add()", "insertEnd()", "push()"], correct: 0 },
      { q: "Remove item from list?", a: ["remove()", "delete()", "erase()", "cut()"], correct: 0 },
      { q: "Dictionary key-value pair?", a: ["key:value", "key=value", "key->value", "key|value"], correct: 0 },
      { q: "Class keyword?", a: ["class", "object", "define", "struct"], correct: 0 },
      { q: "Object created by?", a: ["Class()", "new Class", "object()", "create()"], correct: 0 },
      { q: "Constructor method?", a: ["__init__", "start()", "constructor()", "main()"], correct: 0 },
      { q: "Self refers to?", a: ["Current object", "Class", "Function", "Loop"], correct: 0 },
      { q: "Which reads file?", a: ["open()", "readfile()", "file()", "load()"], correct: 0 },
      { q: "Which converts string to int?", a: ["int()", "str()", "float()", "number()"], correct: 0 },
      { q: "List comprehension returns?", a: ["New list", "String", "Boolean", "Tuple"], correct: 0 }
    ],
  },

  {
  id: 14,
    title: "OOP",
    description: "Intermediate OOP Concepts",
    difficulty: "Intermediate",
    questions: [
      { q: "OOP stands for?", a: ["Object Oriented Programming", "Open Object Program", "Object Operating Program", "Ordered Object Programming"], correct: 0 },
      { q: "OOP basic unit is?", a: ["Object", "Loop", "Variable", "Function"], correct: 0 },
      { q: "Blueprint of object?", a: ["Class", "Method", "Variable", "Loop"], correct: 0 },
      { q: "Encapsulation means?", a: ["Data hiding", "Inheritance", "Looping", "Printing"], correct: 0 },
      { q: "Inheritance means?", a: ["Reuse properties", "Hide data", "Looping", "Printing"], correct: 0 },
      { q: "Polymorphism means?", a: ["Many forms", "Single form", "No form", "Data hiding"], correct: 0 },
      { q: "Abstraction means?", a: ["Hide implementation", "Show everything", "Looping", "Printing"], correct: 0 },
      { q: "Object is?", a: ["Instance of class", "Function", "Loop", "Variable"], correct: 0 },
      { q: "Access modifier example?", a: ["private", "loop", "switch", "array"], correct: 0 },
      { q: "Public means?", a: ["Accessible everywhere", "Hidden", "Protected", "Private"], correct: 0 },
      { q: "Private means?", a: ["Accessible inside class", "Everywhere", "Outside only", "Protected"], correct: 0 },
      { q: "Protected means?", a: ["Class and subclass", "Everywhere", "Only object", "None"], correct: 0 },
      { q: "Constructor is?", a: ["Special method", "Loop", "Variable", "Operator"], correct: 0 },
      { q: "Constructor runs when?", a: ["Object created", "Program ends", "Loop runs", "Method called"], correct: 0 },
      { q: "Method is?", a: ["Function in class", "Variable", "Loop", "Object"], correct: 0 },
      { q: "Overloading means?", a: ["Same name different parameters", "Same class", "Same variable", "Inheritance"], correct: 0 },
      { q: "Overriding requires?", a: ["Inheritance", "Loop", "Array", "Variable"], correct: 0 },
      { q: "this keyword refers?", a: ["Current object", "Parent class", "Function", "Loop"], correct: 0 },
      { q: "Super keyword refers?", a: ["Parent class", "Child class", "Object", "Loop"], correct: 0 },
      { q: "Multiple objects share?", a: ["Class", "Loop", "Variable", "Array"], correct: 0 }
    ],
  },

  {
    id: 15,
    title: "Algorithm ",
    description: "Intermediate Algorithm Concepts",
    difficulty: "Intermediate",
    questions: [
      { q: "Algorithm is?", a: ["Step-by-step solution", "Programming language", "Database", "Variable"], correct: 0 },
      { q: "Time complexity measures?", a: ["Execution time growth", "Memory size", "Variables", "Loops only"], correct: 0 },
      { q: "O(n) means?", a: ["Linear growth", "Constant time", "Quadratic", "Logarithmic"], correct: 0 },
      { q: "O(1) means?", a: ["Constant time", "Linear time", "Slow time", "Infinite"], correct: 0 },
      { q: "Binary search requires?", a: ["Sorted array", "Unsorted array", "Object", "Tree"], correct: 0 },
      { q: "Binary search complexity?", a: ["O(log n)", "O(n)", "O(n²)", "O(1)"], correct: 0 },
      { q: "Linear search complexity?", a: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correct: 0 },
      { q: "Bubble sort complexity?", a: ["O(n²)", "O(log n)", "O(n)", "O(1)"], correct: 0 },
      { q: "Fastest sorting average?", a: ["Quick sort", "Bubble sort", "Linear sort", "Simple sort"], correct: 0 },
      { q: "Loop inside loop gives?", a: ["O(n²)", "O(n)", "O(1)", "O(log n)"], correct: 0 },
      { q: "Flowchart represents?", a: ["Algorithm steps", "Database", "Language", "Compiler"], correct: 0 },
      { q: "Pseudo code is?", a: ["Algorithm description", "Programming language", "Compiler", "Machine code"], correct: 0 },
      { q: "Recursion means?", a: ["Function calls itself", "Loop", "Variable", "Array"], correct: 0 },
      { q: "Base case needed for?", a: ["Stop recursion", "Start program", "Loop", "Sorting"], correct: 0 },
      { q: "Stack uses?", a: ["LIFO", "FIFO", "Random", "Sorted"], correct: 0 },
      { q: "Queue uses?", a: ["FIFO", "LIFO", "Random", "Sorted"], correct: 0 },
      { q: "Best search algorithm?", a: ["Binary search", "Linear search", "Bubble search", "Simple search"], correct: 0 },
      { q: "Worst case complexity?", a: ["Maximum time", "Minimum time", "Average time", "No time"], correct: 0 },
      { q: "Best case complexity?", a: ["Minimum time", "Maximum time", "Average time", "No time"], correct: 0 },
      { q: "Divide and conquer example?", a: ["Merge sort", "Linear search", "Bubble sort", "Simple loop"], correct: 0 }
    ],
  },

  {
    id: 16,
    title: "CSS",
    description: "Intermediate CSS Concepts",
    difficulty: "Intermediate",
    questions: [
      { q: "CSS stands for?", a: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System", "Color Style Sheets"], correct: 0 },
      { q: "Which selector selects id?", a: ["#id", ".id", "*id", "@id"], correct: 0 },
      { q: "Which selector selects class?", a: [".class", "#class", "*class", "@class"], correct: 0 },
      { q: "Display flex enables?", a: ["Flexible layout", "Colors", "Fonts", "Animation"], correct: 0 },
      { q: "Flex direction row means?", a: ["Horizontal layout", "Vertical layout", "Diagonal", "None"], correct: 0 },
      { q: "Position absolute means?", a: ["Relative to parent", "Screen fixed", "Normal flow", "Inline"], correct: 0 },
      { q: "Position fixed means?", a: ["Fixed on screen", "Relative parent", "Inline", "Hidden"], correct: 0 },
      { q: "Z-index controls?", a: ["Layer order", "Color", "Size", "Font"], correct: 0 },
      { q: "Margin controls?", a: ["Outside space", "Inside space", "Border", "Color"], correct: 0 },
      { q: "Padding controls?", a: ["Inside space", "Outside space", "Border", "Height"], correct: 0 },
      { q: "Grid layout uses?", a: ["display: grid", "display: flex", "display: block", "display: inline"], correct: 0 },
      { q: "Responsive design uses?", a: ["Media queries", "Loops", "Variables", "Functions"], correct: 0 },
      { q: "Hover effect selector?", a: [":hover", ".hover", "#hover", "*hover"], correct: 0 },
      { q: "Font size property?", a: ["font-size", "text-size", "size", "fontstyle"], correct: 0 },
      { q: "Background color property?", a: ["background-color", "bgcolor", "color-bg", "backgroundstyle"], correct: 0 },
      { q: "Center text property?", a: ["text-align", "align-text", "center-text", "font-align"], correct: 0 },
      { q: "Border property controls?", a: ["Element border", "Text", "Layout", "Spacing"], correct: 0 },
      { q: "Overflow hidden means?", a: ["Hide extra content", "Scroll", "Expand", "Zoom"], correct: 0 },
      { q: "Inline element example?", a: ["span", "div", "section", "header"], correct: 0 },
      { q: "Block element example?", a: ["div", "span", "a", "b"], correct: 0 }
    ],
  },

  {
    id: 17,
    title: "CSS",
    description: "Expert Level Styling",
    difficulty: "Advanced",
    questions: [
      { q: "Which selector has highest specificity?", a: ["Class", "Element", "ID", "Universal"], correct: 2 },
      { q: "What does z-index control?", a: ["Font size", "Stacking order", "Spacing", "Opacity"], correct: 1 },
      { q: "Position relative means?", a: ["Relative to viewport", "Relative to parent", "Relative to itself", "Fixed position"], correct: 2 },
      { q: "Position fixed is relative to?", a: ["Parent", "Viewport", "Body", "Div"], correct: 1 },
      { q: "Which unit is relative to root font size?", a: ["em", "px", "rem", "%"], correct: 2 },
      { q: "Flexbox main axis controlled by?", a: ["align-items", "justify-content", "flex-wrap", "gap"], correct: 1 },
      { q: "Flexbox cross axis controlled by?", a: ["justify-content", "align-items", "order", "grow"], correct: 1 },
      { q: "Grid columns define property?", a: ["grid-template-columns", "grid-columns", "column-layout", "grid-style"], correct: 0 },
      { q: "Auto-fit vs auto-fill used in?", a: ["Flexbox", "Grid", "Positioning", "Animation"], correct: 1 },
      { q: "Overflow hidden does?", a: ["Shows scroll", "Hides extra content", "Resizes box", "Centers content"], correct: 1 },
      { q: "Which property creates smooth animation?", a: ["transition", "animate", "motion", "effect"], correct: 0 },
      { q: "Animation infinite loop?", a: ["loop:true", "animation-loop", "animation-iteration-count: infinite", "repeat:infinite"], correct: 2 },
      { q: "Transform rotate example?", a: ["rotate(45deg)", "turn(45)", "angle(45)", "spin(45)"], correct: 0 },
      { q: "Scale element property?", a: ["resize()", "scale()", "grow()", "expand()"], correct: 1 },
      { q: "Which pseudo-class selects first child?", a: [":first", ":child-first", ":first-child", ":start"], correct: 2 },
      { q: "Which pseudo-element selects first letter?", a: ["::letter", "::first-letter", ":letter", ":first-letter"], correct: 1 },
      { q: "Variable declaration syntax?", a: ["$color:red", "--color:red", "var=color", "@color:red"], correct: 1 },
      { q: "Using CSS variable?", a: ["use(--color)", "get(color)", "var(--color)", "color(var)"], correct: 2 },
      { q: "Media query syntax?", a: ["@media screen", "@screen", "media()", "screen@"], correct: 0 },
      { q: "Responsive unit?", a: ["px", "cm", "vw", "pt"], correct: 2 },
      { q: "Center div horizontally?", a: ["margin:auto", "align:center", "position:center", "center:true"], correct: 0 },
      { q: "Shadow property?", a: ["shadow-box", "box-shadow", "element-shadow", "shadow"], correct: 1 },
      { q: "Text shadow property?", a: ["font-shadow", "text-shadow", "shadow-text", "text-effect"], correct: 1 },
      { q: "Opacity range?", a: ["0-1", "0-10", "1-100", "0-255"], correct: 0 },
      { q: "Display none does?", a: ["Hidden but space remains", "Removes element", "Transparent", "Disabled"], correct: 1 },
      { q: "Visibility hidden does?", a: ["Remove element", "Keep space but hide", "Delete element", "Opacity 0"], correct: 1 },
      { q: "Object-fit cover means?", a: ["Stretch image", "Crop to fill", "Repeat image", "Hide image"], correct: 1 },
      { q: "Min width property?", a: ["width-min", "min-width", "minimum-width", "limit-width"], correct: 1 },
      { q: "Max width property?", a: ["width-max", "max-width", "limit-width", "width-limit"], correct: 1 },
      { q: "Which property changes cursor?", a: ["mouse", "cursor", "pointer-style", "hover-cursor"], correct: 1 }
    ],
  },

  {
    id: 18,
    title: "JavaScript",
    description: "Expert Level JavaScript",
    difficulty: "Advanced",
    questions: [
      { q: "Closure stores?", a: ["Local scope","Global scope","Parent scope variables","Loop data"], correct: 2 },
      { q: "Async function returns?", a: ["Object","Promise","String","Number"], correct: 1 },
      { q: "Await works with?", a: ["Loops","Promises","Objects","Strings"], correct: 1 },
      { q: "Strict equality operator?", a: ["==","===","!=","="], correct: 1 },
      { q: "Spread operator symbol?", a: ["...","***","///","+++"], correct: 0 },
      { q: "Template string uses?", a: ["''","\"\"","``","<>"], correct: 2 },
      { q: "JSON to object?", a: ["JSON.parse()","JSON.make()","JSON.object()","JSON.convert()"], correct: 0 },
      { q: "Object to JSON?", a: ["JSON.parse()","JSON.stringify()","JSON.make()","JSON.object()"], correct: 1 },
      { q: "Block scope variable?", a: ["var","let","const","Both let and const"], correct: 3 },
      { q: "typeof null returns?", a: ["null","object","undefined","number"], correct: 1 },
      { q: "Array map returns?", a: ["Boolean","New array","String","Object"], correct: 1 },
      { q: "Filter returns?", a: ["Single value","New array","Boolean","String"], correct: 1 },
      { q: "Reduce returns?", a: ["Array","Boolean","Single value","String"], correct: 2 },
      { q: "Event listener method?", a: ["addEventListener()","listenEvent()","onClick()","attach()"], correct: 0 },
      { q: "Stop event bubbling?", a: ["prevent()","stop()","stopPropagation()","cancel()"], correct: 2 },
      { q: "Local storage type?", a: ["Object","String","Function","Array"], correct: 1 },
      { q: "Session storage ends when?", a: ["Refresh","Browser close","Logout","Forever"], correct: 1 },
      { q: "Arrow function uses?", a: ["=>","->","==>", "::"], correct: 0 },
      { q: "Default export keyword?", a: ["export default","export main","default export","module export"], correct: 0 },
      { q: "Import keyword?", a: ["require","include","import","using"], correct: 2 },
      { q: "Promise success method?", a: [".then()",".catch()",".error()",".done()"], correct: 0 },
      { q: "Promise error method?", a: [".then()",".catch()",".done()",".stop()"], correct: 1 },
      { q: "Delay function?", a: ["setTime()","setTimeout()","delay()","wait()"], correct: 1 },
      { q: "Repeat function?", a: ["setLoop()","setRepeat()","setInterval()","repeat()"], correct: 2 },
      { q: "this refers to?", a: ["Window always","Current object","Parent object","Document"], correct: 1 },
      { q: "Const variable?", a: ["Changeable","Fixed value","Function only","Temporary"], correct: 1 },
      { q: "Let variable scope?", a: ["Global","Block","Function","Window"], correct: 1 },
      { q: "NaN means?", a: ["New number","Not a Number","Negative number","Null number"], correct: 1 },
      { q: "Destructuring does?", a: ["Sort data","Extract values","Delete values","Copy values"], correct: 1 },
      { q: "Deep copy method?", a: ["=","Object.assign()","JSON.parse(JSON.stringify(obj))","copy(obj)"], correct: 2 }
    ],
  },
  
  {
    id: 19,
    title: "Java",
    description: "Expert Level Java Programming",
    difficulty: "Advanced",
    questions: [
      { q: "Which keyword creates a class?", a: ["class","object","new","define"], correct: 0 },
      { q: "Which method is entry point?", a: ["main()","start()","run()","init()"], correct: 0 },
      { q: "Primitive type for decimal?", a: ["int","float","boolean","char"], correct: 1 },
      { q: "Primitive type for true/false?", a: ["int","double","boolean","char"], correct: 2 },
      { q: "Which creates object?", a: ["class","new","object","define"], correct: 1 },
      { q: "Which is inheritance keyword?", a: ["implements","extends","inherits","super"], correct: 1 },
      { q: "Abstract method must be in?", a: ["Concrete class","Interface","Abstract class","Object"], correct: 2 },
      { q: "Interface keyword?", a: ["interface","implements","abstract","extends"], correct: 0 },
      { q: "Package import keyword?", a: ["include","import","require","package"], correct: 1 },
      { q: "Static variable belongs to?", a: ["Object","Class","Method","Instance"], correct: 1 },
      { q: "Final variable means?", a: ["Mutable","Constant","Overridable","Temporary"], correct: 1 },
      { q: "Which keyword prevents method override?", a: ["final","static","private","const"], correct: 0 },
      { q: "Constructor has?", a: ["Return type","No return type","void","int"], correct: 1 },
      { q: "Which loop guarantees at least one execution?", a: ["for","while","do-while","foreach"], correct: 2 },
      { q: "Which keyword handles exception?", a: ["try","catch","throw","All of these"], correct: 3 },
      { q: "Throw keyword?", a: ["Raises exception","Catches exception","Defines method","Loops"], correct: 0 },
      { q: "Which method is used to start thread?", a: ["run()","start()","execute()","init()"], correct: 1 },
      { q: "Which package contains Thread class?", a: ["java.util","java.lang","java.io","java.thread"], correct: 1 },
      { q: "Generics used for?", a: ["Type safety","Loops","Exceptions","Objects"], correct: 0 },
      { q: "Which is checked exception?", a: ["ArithmeticException","IOException","NullPointerException","ArrayIndexOutOfBoundsException"], correct: 1 },
      { q: "Which is unchecked exception?", a: ["IOException","SQLException","NullPointerException","FileNotFoundException"], correct: 2 },
      { q: "String is?", a: ["Primitive","Object","Interface","Class"], correct: 1 },
      { q: "Which method compares strings?", a: ["==","equals()","compareTo()","All"], correct: 3 },
      { q: "Which collection allows duplicate?", a: ["Set","Map","List","Queue"], correct: 2 },
      { q: "Which collection no duplicates?", a: ["Set","List","Map","Queue"], correct: 0 },
      { q: "HashMap key type must?", a: ["Unique","Duplicate","Primitive","Object"], correct: 0 },
      { q: "Which keyword for interface implementation?", a: ["implements","extends","inherit","override"], correct: 0 },
      { q: "Super keyword refers to?", a: ["Parent class","Child class","Interface","Method"], correct: 0 },
      { q: "this keyword refers to?", a: ["Current object","Parent object","Class object","Static object"], correct: 0 },
      { q: "Synchronized keyword used for?", a: ["Thread safety","Variable declaration","Loop control","Exception handling"], correct: 0 }
    ],
  },

  {
    id: 20,
    title: "HTML",
    description: "Expert Level HTML",
    difficulty: "Advanced",
    questions: [
      { q: "HTML stands for?", a: ["Hyper Text Markup Language","Home Tool Markup Language","Hyperlinks Text Mark Language","Hyper Tool Multi Language"], correct: 0 },
      { q: "Root element of HTML?", a: ["<html>","<body>","<head>","<div>"], correct: 0 },
      { q: "Metadata goes inside?", a: ["<head>","<body>","<footer>","<section>"], correct: 0 },
      { q: "Main content goes inside?", a: ["<body>","<head>","<meta>","<link>"], correct: 0 },
      { q: "Self-closing tag?", a: ["<br>","<div>","<p>","<span>"], correct: 0 },
      { q: "HTML comment syntax?", a: ["<!-- Comment -->","// Comment","/* Comment */","# Comment"], correct: 0 },
      { q: "Which tag defines a hyperlink?", a: ["<a>","<link>","<href>","<hyper>"], correct: 0 },
      { q: "Open link in new tab?", a: ["target='_blank'","rel='new'","open='_tab'","href='new'"], correct: 0 },
      { q: "Image tag attribute for source?", a: ["src","href","link","ref"], correct: 0 },
      { q: "Image alt attribute?", a: ["Alternative text","Source text","Reference text","Hyperlink text"], correct: 0 },
      { q: "HTML table row?", a: ["<tr>","<td>","<th>","<table>"], correct: 0 },
      { q: "HTML table header?", a: ["<th>","<td>","<tr>","<thead>"], correct: 0 },
      { q: "Table data cell?", a: ["<td>","<tr>","<th>","<table>"], correct: 0 },
      { q: "Form element tag?", a: ["<form>","<input>","<button>","<label>"], correct: 0 },
      { q: "Input text field type?", a: ["text","password","number","email"], correct: 0 },
      { q: "Input password field type?", a: ["password","text","hidden","secure"], correct: 0 },
      { q: "Submit button type?", a: ["submit","button","reset","form"], correct: 0 },
      { q: "Label for input?", a: ["<label>","<span>","<div>","<input>"], correct: 0 },
      { q: "HTML5 semantic tag for header?", a: ["<header>","<head>","<top>","<section>"], correct: 0 },
      { q: "HTML5 semantic tag for footer?", a: ["<footer>","<foot>","<bottom>","<section>"], correct: 0 },
      { q: "HTML5 semantic tag for main content?", a: ["<main>","<section>","<article>","<div>"], correct: 0 },
      { q: "HTML5 semantic tag for section?", a: ["<section>","<div>","<article>","<span>"], correct: 0 },
      { q: "HTML5 semantic tag for article?", a: ["<article>","<section>","<div>","<main>"], correct: 0 },
      { q: "Meta tag for charset?", a: ["<meta charset='UTF-8'>","<meta type='UTF-8'>","<meta code='UTF-8'>","<meta encoding='UTF-8'>"], correct: 0 },
      { q: "Favicon tag?", a: ["<link rel='icon' href='favicon.ico'>","<meta icon='favicon.ico'>","<link href='favicon.ico'>","<favicon>"], correct: 0 },
      { q: "HTML5 video tag?", a: ["<video>","<media>","<movie>","<play>"], correct: 0 },
      { q: "Video autoplay attribute?", a: ["autoplay","play","start","run"], correct: 0 },
      { q: "Audio tag?", a: ["<audio>","<sound>","<music>","<media>"], correct: 0 },
      { q: "Audio autoplay?", a: ["autoplay","play","start","run"], correct: 0 },
      { q: "HTML5 canvas tag?", a: ["<canvas>","<draw>","<paint>","<svg>"], correct: 0 }
    ],
  },

];

const Quiz = () => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timer, setTimer] = useState(60);
  const [activeTab, setActiveTab] = useState("Beginner");

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimer(600);
  };

  useEffect(() => {
    if (!selectedQuiz || showResult) return;
    if (timer <= 0) {
      setShowResult(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, selectedQuiz, showResult]);

  const answerQuestion = (idx) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);
    setAnswers((prev) => [...prev, idx]);
    setTimeout(() => {
      if (currentQ + 1 < selectedQuiz.questions.length) {
        setCurrentQ((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 800);
  };

  const score = useMemo(() => {
    if (!selectedQuiz) return 0;
    return answers.filter(
      (a, i) => a === selectedQuiz.questions[i]?.correct
    ).length;
  }, [answers, selectedQuiz]);

  const totalQuestions = selectedQuiz?.questions.length || 0;
  const progress =
    selectedQuiz && totalQuestions > 0
      ? Math.round(((currentQ + 1) / totalQuestions) * 100)
      : 0;

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimer(60);
  };

  const restartQuiz = () => {
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimer(60);
  };

  const filteredQuizzes = quizzes.filter(q => q.difficulty === activeTab);

  return (
    <div className="quiz-page">
      <header className="header">
        <div className="menu-icon" onClick={resetQuiz}>←</div>
        <div className="logo">📝 Skills Quiz</div>
      </header>

      <div className="quiz-container">
        {!selectedQuiz && (
          <>
            <div className="dashboard-tabs">
              {["Beginner", "Intermediate", "Advanced"].map(tab => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="quiz-grid">
              {filteredQuizzes.map((quiz) => (
                <div key={quiz.id} className="quiz-card">
                  <h3>{quiz.title}</h3>
                  <p>{quiz.description}</p>
                  <span className="quiz-count">{quiz.questions.length} Questions</span>
                  <button className="primary-btn" onClick={() => startQuiz(quiz)}>Start Quiz</button>
                </div>
              ))}
            </div>
          </>
        )}

        {selectedQuiz && showResult && (
          <div className="result-box">
            <h2>{selectedQuiz.title}</h2>
            <p>Your Score: {score} / {totalQuestions}</p>
            <p>Accuracy: {Math.round((score / totalQuestions) * 100)}%</p>
            <div className="result-actions">
              <button className="primary-btn" onClick={restartQuiz}>Try Again</button>
              <button className="ghost-btn" onClick={resetQuiz}>Browse Quizzes</button>
            </div>
          </div>
        )}

        {selectedQuiz && !showResult && (
          <div className="quiz-player">
            <div className="timer">⏱ {timer}s left</div>
            <h2>{selectedQuiz.title}</h2>
            <p>Question {currentQ + 1} of {totalQuestions}</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="question-card">
              <h3>{selectedQuiz.questions[currentQ].q}</h3>
              <div className="answers">
                {selectedQuiz.questions[currentQ].a.map((ans, idx) => {
                  const correctIndex = selectedQuiz.questions[currentQ].correct;
                  let className = "answer-btn";
                  if (isAnswered) {
                    if (idx === correctIndex) className += " correct";
                    else if (idx === selectedAnswer) className += " wrong";
                  }
                  return (
                    <button
                      key={idx}
                      className={className}
                      onClick={() => answerQuestion(idx)}
                      disabled={isAnswered}
                    >
                      {ans}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;