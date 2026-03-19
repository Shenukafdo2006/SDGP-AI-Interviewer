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
      { q: "Which declares a variable?", a: ["var", "let","All", "const" ], correct: 2 },
      { q: "=== means?", a: ["Equal value", "Equal value & type", "Assign", "Compare"], correct: 1 },
      { q: "Convert JSON to object?", a: [ "JSON.stringify()", "JSON.toObj()", "JSON.convert()", "JSON.parse()"], correct: 3 },
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
      { q: "Which method starts execution?", a: ["main()","start()",  "run()", "execute()"], correct: 0 },
      { q: "Primitive type for decimal?", a: ["int", "double", "String", "float"], correct: 1 },
      { q: "Inheritance keyword?", a: ["extend", "implements", "inherit","extends"], correct: 3 },
      { q: "Java supports multiple inheritance via?", a: ["Class", "Interface", "Abstract", "Package"], correct: 1 },
      { q: "Access modifier for everything?", a: ["private", "public", "protected", "default"], correct: 1 },
      { q: "Default value of boolean?", a: ["false","true", "0", "null"], correct: 0 },
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
      { q: "Hyperlink tag?", a: ["<link>", "<href>", "<h1>","<a>"], correct: 3 },
      { q: "Image tag?", a: ["<image>", "<src>","<img>", "<pic>"], correct: 2 },
      { q: "Largest heading?", a: ["<h6>", "<h1>", "<head>", "<title>"], correct: 1 },
      { q: "Paragraph tag?", a: ["<para>", "<p>", "<text>", "<pg>"], correct: 1 },
      { q: "Line break tag?", a: ["<br>", "<lb>", "<break>", "<hr>"], correct: 0 },
      { q: "Table row?", a: ["<td>", "<tr>", "<th>", "<table>"], correct: 3 },
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
      { q: "Python is ___ typed language?", a: ["Weakly", "Both", "None","Strongly"], correct: 3 },
      { q: "Function keyword?", a: [ "func","def", "function", "define"], correct: 1 },
      { q: "Print to console?", a: ["console.log()", "echo()","print()", "write()"], correct: 2 },
      { q: "List indexing starts at?", a: ["0", "1", "-1", "None"], correct: 0 },
      { q: "Python file extension?", a: [".java", ".py", ".js", ".txt"], correct: 1 },
      { q: "Loop over sequence?", a: [ "while", "loop", "foreach","for"], correct: 3 },
      { q: "Python comment?", a: ["//", "#", "/* */", "<!-- -->"], correct: 1 },
      { q: "Dictionary key-value syntax?", a: ["{}", "[]", "()", "<>"], correct: 0 },
      { q: "Boolean True value?", a: [ "true", "1", "True","Yes"], correct: 2 },
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
      { q: "Inheritance allows?", a: [ "Data hiding", "Code reuse","Object creation", "Compilation"], correct: 1 },
      { q: "Polymorphism is?", a: [ "Single form", "Many forms","Variable type", "None"], correct: 1 },
      { q: "Class vs Object?", a: ["Template vs Instance", "Instance vs Template", "Function vs Variable", "None"], correct: 0 },
      { q: "Abstraction is?", a: ["Hiding implementation", "Encapsulation", "Inheritance", "Polymorphism"], correct: 0 },
      { q: "Method overriding?", a: [ "Child adds new method", "Parent method deletion","Child changes parent method", "None"], correct: 2 },
      { q: "Constructor purpose?", a: ["Initialize object", "Destroy object", "Return object", "None"], correct: 0 },
      { q: "Access specifier?", a: ["public/private/protected", "int/float/string", "if/else/for", "None"], correct: 0 },
      { q: "OOP main concept?", a: [ "Only Inheritance", "Only Encapsulation","Encapsulation, Inheritance, Polymorphism, Abstraction", "None"], correct: 2 },
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
      { q: "Sorting type?", a: [ "Add, Delete, Pop","Bubble, Merge, Quick", "Push, Pop, Shift", "None"], correct: 1 },
      { q: "Searching type?", a: [ "Loop, Conditional", "Linear, Binary","Add, Remove", "None"], correct: 1 },
      { q: "Complexity of linear search?", a: [ "O(log n)","O(n)", "O(n^2)", "O(1)"], correct: 1 },
      { q: "Complexity of binary search?", a: [ "O(n)", "O(n^2)", "O(log n)","O(1)"], correct: 2 },
      { q: "Algorithm efficiency depends on?", a: [ "Memory only", "CPU only","Time & Space", "None"], correct: 2 },
      { q: "Recursion is?", a: [ "Loop", "Iteration", "Array","Function calling itself"], correct: 3 },
      { q: "Divide and Conquer?", a: [ "Combine arrays", "Sort data","Divide problem into subproblems", "Loop"], correct: 2 },
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
      { q: "Text color property?", a: ["font-color",  "text-style","color", "fg"], correct: 2 },
      { q: "Inside spacing?", a: ["margin", "padding", "border", "space"], correct: 1 },
      { q: "Outside spacing?", a: [ "padding","margin", "gap", "border"], correct: 1 },
      { q: "Flexbox property?", a: ["display:flex", "flexbox:true", "align:flex", "box:flex"], correct: 0 },
      { q: "Center text?", a: ["align:center", "text-align:center", "center:true", "justify:center"], correct: 1 },
      { q: "Background color?", a: ["bgcolor", "background-color", "color-bg", "fill"], correct: 1 },
      { q: "Border radius?", a: ["corner",  "round", "radius","border-radius"], correct: 3 },
      { q: "Grid layout?", a: [ "layout:grid", "grid:true","display:grid", "use:grid"], correct: 2 },
      { q: "Hover effect?", a: [ "::hover", ".hover", ":hover","#hover"], correct: 2 },
    ],
  },

  {
  id: 8,
  title: "React Fundamentals",
  description: "Core React Concepts for Beginners",
  difficulty: "Beginner",
  questions: [
    { q: "React is a?", a: [ "Framework", "Language", "Database","Library",], correct: 3 },
    { q: "Which hook is used to store state?", a: [ "useEffect", "useRef", "useState","useMemo"], correct: 2 },
    { q: "JSX stands for?", a: ["JavaScript XML", "Java Syntax X", "JSON XML", "Just Simple X"], correct: 0 },
    { q: "How do you pass data to a component?", a: [ "State","Props", "Hooks", "Variables"], correct: 1 },
    { q: "Which hook runs side effects?", a: ["useEffect", "useState", "useRef", "useMemo"], correct: 0 },
    { q: "A component must return?", a: [ "HTML", "CSS", "Text","JSX",], correct: 3},
    { q: "Keys in lists help with?", a: [ "Styling", "API calls","Performance", "Routing"], correct: 2 },
    { q: "React was developed by?", a: [ "Google","Facebook", "Microsoft", "Apple"], correct: 1 },
    { q: "Fragment syntax in React is?", a: ["<>...</>", "<div>...</div>", "<frag>...</frag>", "<React>...</React>"], correct: 0 },
    { q: "React uses a virtual?", a: [ "Database", "Hook", "Component Tree","DOM",], correct: 3 },
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
      { q: "JSX stands for?", a: [ "Java Syntax X", "JSON XML", "None","JavaScript XML"], correct: 3 },
      { q: "Props are?", a: ["Data passed to components", "State", "Hooks", "CSS"], correct: 0 },
      { q: "Virtual DOM is?", a: [ "Database", "Hook", "Copy of real DOM","Server"], correct: 2 },
      { q: "Side effects hook?", a: ["useState",  "useMemo", "useHook","useEffect"], correct: 3 },
      { q: "Component must return?", a: ["HTML",  "CSS", "JSON","JSX"], correct: 3 },
      { q: "Key prop is for?", a: ["Performance",  "Styling","List rendering", "API"], correct: 2 },
      { q: "React created by?", a: ["Google", "Facebook", "Microsoft", "Amazon"], correct: 1 },
      { q: "Fragment syntax?", a: [ "<div>","<> </>", "<frag>", "<React>"], correct: 1 },
      { q: "useRef is used for?", a: [ "State", "Routing", "API calls","DOM reference"], correct: 3 },
      { q: "Which is used for routing?", a: ["React Router", "Redux", "Axios", "Bootstrap"], correct: 0 },
      { q: "State is?", a: ["Immutable", "Mutable", "CSS", "HTML"], correct: 1 },
      { q: "setState is?", a: ["Synchronous",  "CSS","Asynchronous", "Hook"], correct: 2 },
      { q: "Parent to child data flow?", a: [ "State", "Hooks", "API","Props"], correct: 3 },
      { q: "Which installs React?", a: [ "npm get react", "install react", "npm install react","node react"], correct: 2 },
      { q: "Default port React runs?", a: [ "5000","3000", "8000", "8080"], correct: 1 },
      { q: "Class component uses?", a: ["Hooks", "Lifecycle Methods", "JSX only", "API"], correct: 1 },
      { q: "React app build command?", a: ["npm run start",  "npm build", "npm run build","react build"], correct: 2 },
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
      { q: "Difference between == and === ?", a: [ "Value only", "Type only","Type + value", "None"], correct: 2 },
      { q: "What is closure?", a: [ "Loop","Function with preserved scope", "Variable", "Object"], correct: 1 },
      { q: "Arrow functions use?", a: [ "->", "==>", "::","=>"], correct: 3 },
      { q: "Which method adds item to array end?", a: [ "pop()", "shift()","push()", "slice()"], correct: 2 },
      { q: "Which method removes last item?", a: [ "push()", "shift()", "map()","pop()"], correct: 3 },
      { q: "map() returns?", a: [ "Boolean", "Number","New array", "Object"], correct: 2 },
      { q: "filter() returns?", a: [ "Number","Filtered array", "String", "Boolean"], correct: 1},
      { q: "What is JSON?", a: [ "Function", "Loop", "Variable","Data format"], correct: 3 },
      { q: "Convert object to JSON?", a: [ "JSON.parse()", "toJSON()", "string()","JSON.stringify()"], correct: 3 },
      { q: "Convert JSON to object?", a: [ "JSON.stringify()","JSON.parse()", "parseJSON()", "toObject()"], correct: 1 },
      { q: "Promise represents?", a: [ "Loop","Future value", "Variable", "Array"], correct: 1 },
      { q: "Async function keyword?", a: [ "await", "promise","async", "defer"], correct: 2 },
      { q: "Await works with?", a: [ "Arrays", "Objects", "Loops","Promises"], correct: 3 },
      { q: "Spread operator?", a: [ ":::", "***","...", "&&&"], correct: 2 },
      { q: "Rest parameter uses?", a: ["###", "$$$","...", "%%"], correct: 2 },
      { q: "Template strings use?", a: [ "' '","` `", "\" \"", "< >"], correct: 1 },
      { q: "Which method finds first match?", a: [ "map()","find()", "reduce()", "every()"], correct: 1 },
      { q: "reduce() returns?", a: [ "Array","Single value", "Boolean", "Object"], correct: 1 },
      { q: "typeof null returns?", a: [ "null", "object","undefined", "string"], correct: 1 }
    ],
  },
  
  {
    id: 11,
    title: "Java ",
    description: "Intermediate Java Concepts",
    difficulty: "Intermediate",
    questions: [
      { q: "Java is a?", a: ["Object Oriented Language", "Database", "Operating System", "Browser"], correct: 0 },
      { q: "Which keyword creates an object?", a: [ "create", "object","new", "make"], correct: 2 },
      { q: "Parent class is called?", a: [ "Childclass", "Subclass","Superclass", "Object"], correct: 2 },
      { q: "Child class is called?", a: ["Subclass", "Superclass", "Parent", "Root"], correct: 0 },
      { q: "Method overloading means?", a: ["Same method different parameters", "Same class", "Different classes", "Same variables"], correct: 0 },
      { q: "Method overriding requires?", a: ["Inheritance", "Loop", "Array", "Interface"], correct: 0 },
      { q: "Which access modifier is most restricted?", a: [ "public", "protected", "default","private"], correct: 3 },
      { q: "Array index starts at?", a: [ "1", "-1", "Depends","0"], correct: 3 },
      { q: "Exception handled by?", a: ["try-catch", "if-else", "loop", "switch"], correct: 0 },
      { q: "Which keyword inherits class?", a: ["extends", "implements", "inherits", "super"], correct: 0 },
      { q: "Interface uses keyword?", a: ["implements", "extends", "inherit", "interfaceuse"], correct: 0 },
      { q: "Abstract class keyword?", a: ["abstract", "virtual", "interface", "class"], correct: 0 },
      { q: "Main method signature?", a: ["public static void main(String[] args)", "main()", "void main()", "start()"], correct: 0 },
      { q: "Static keyword means?", a: [ "Belongs to object","Belongs to class", "Variable", "Constant"], correct: 1 },
      { q: "Final keyword means?", a: [ "Loop", "Method","Cannot change", "Object"], correct: 2 },
      { q: "Constructor name must be?", a: [ "Any name", "start", "init","Same as class"], correct: 3 },
      { q: "Polymorphism means?", a: [ "One class","Many forms", "One object", "Loop"], correct: 1 },
      { q: "Encapsulation means?", a: [ "Inheritance","Data hiding", "Looping", "Printing"], correct: 1 },
      { q: "Which stores multiple values?", a: ["Array", "int", "double", "char"], correct: 0 },
      { q: "Scanner class used for?", a: [ "Output", "User input","Math", "Files"], correct: 1 }
    ],
  },

  {
    id: 12,
    title: "HTML",
    description: "Intermediate HTML Concepts",
    difficulty: "Intermediate",
    questions: [
      { q: "HTML stands for?", a: [ "HighText Machine Language", "Hyper Tool Markup", "HyperText Markup Language","Home Tool Markup"], correct: 2 },
      { q: "Semantic tag example?", a: [ "<div>", "<span>","<article>", "<b>"], correct: 2 },
      { q: "Which tag defines navigation?", a: ["<nav>", "<menu>", "<link>", "<navigate>"], correct: 0 },
      { q: "Which tag embeds video?", a: [ "<media>", "<video>","<movie>", "<embedvideo>"], correct: 1 },
      { q: "Which tag embeds audio?", a: [ "<sound>","<audio>", "<music>", "<mp3>"], correct: 1 },
      { q: "Form submission method attribute?", a: [ "type", "actionto", "submit","method"], correct: 3 },
      { q: "Form data sent to?", a: [ "method", "target", "name","action"], correct: 3 },
      { q: "Required input attribute?", a: ["required", "validate", "must", "needed"], correct: 0 },
      { q: "Placeholder attribute shows?", a: [ "Value", "Hint text","Label", "Title"], correct: 1 },
      { q: "Which input type for email?", a: [ "mail", "textmail","email", "inputmail"], correct: 2 },
      { q: "Open link new tab?", a: ['target="_blank"', 'target="new"', 'newtab', 'blank'], correct: 0 },
      { q: "Image alternative text attribute?", a: [ "title", "src", "alt","text"], correct: 2 },
      { q: "Table row tag?", a: [ "<td>", "<th>", "<table>","<tr>",], correct: 1 },
      { q: "Table header tag?", a: ["<th>", "<td>", "<tr>", "<thead>"], correct: 0 },
      { q: "Grouping form elements?", a: [ "<group>", "<formgroup>","<fieldset>", "<section>"], correct: 2 },
      { q: "Dropdown list tag?", a: [ "<dropdown>", "<list>", "<optionlist>","<select>"], correct: 3 },
      { q: "Option inside dropdown?", a: ["<option>", "<item>", "<choice>", "<selectitem>"], correct: 0 },
      { q: "Meta viewport used for?", a: [ "SEO","Responsive design", "JavaScript", "Forms"], correct: 1 },
      { q: "Inline element example?", a: [ "<div>", "<section>","<span>", "<article>"], correct: 2 },
      { q: "Block element example?", a: [ "<span>", "<a>", "<b>","<div>"], correct: 3 }
    ],
  },

  {
    id: 13,
    title: "Python",
    description: "Intermediate Python Concepts",
    difficulty: "Intermediate",
    questions: [
      { q: "Python is a?", a: ["Interpreted language", "Database", "Browser", "Operating System"], correct: 0 },
      { q: "Which keyword defines function?", a: [ "function","def", "func", "method"], correct: 1 },
      { q: "List is defined using?", a: [ "{}", "()","[]", "<>"], correct: 2 },
      { q: "Dictionary uses?", a: ["{}", "[]", "()", "<>"], correct: 0 },
      { q: "Tuple uses?", a: [ "[]", "()","{}", "<>"], correct: 1 },
      { q: "Lambda is?", a: [ "Loop", "Variable","Anonymous function", "Class"], correct: 2 },
      { q: "Which handles exceptions?", a: [ "if-else", "loop", "switch","try-except"], correct: 3 },
      { q: "Which imports module?", a: [ "include", "require","import", "using"], correct: 2 },
      { q: "len() returns?", a: ["Length", "Value", "Type", "Index"], correct: 0 },
      { q: "range() used for?", a: [ "Strings","Loops", "Files", "Classes"], correct: 1 },
      { q: "Append item to list?", a: [ "add()", "insertEnd()","append()", "push()"], correct: 2 },
      { q: "Remove item from list?", a: [ "delete()", "erase()", "cut()","remove()"], correct: 3 },
      { q: "Dictionary key-value pair?", a: [ "key=value", "key->value","key:value", "key|value"], correct: 2 },
      { q: "Class keyword?", a: [ "object", "define", "struct","class"], correct: 3 },
      { q: "Object created by?", a: ["Class()", "new Class", "object()", "create()"], correct: 0 },
      { q: "Constructor method?", a: ["__init__", "start()", "constructor()", "main()"], correct: 0 },
      { q: "Self refers to?", a: [ "Class","Current object", "Function", "Loop"], correct: 1 },
      { q: "Which reads file?", a: [ "readfile()", "file()","open()", "load()"], correct: 2 },
      { q: "Which converts string to int?", a: [ "str()","int()", "float()", "number()"], correct: 1 },
      { q: "List comprehension returns?", a: [ "String", "Boolean", "New list","Tuple"], correct: 2 }
    ],
  },

  {
  id: 14,
    title: "OOP",
    description: "Intermediate OOP Concepts",
    difficulty: "Intermediate",
    questions: [
      { q: "OOP stands for?", a: [ "Open Object Program","Object Oriented Programming", "Object Operating Program", "Ordered Object Programming"], correct: 1 },
      { q: "OOP basic unit is?", a: ["Object", "Loop", "Variable", "Function"], correct: 0 },
      { q: "Blueprint of object?", a: [ "Method","Class", "Variable", "Loop"], correct: 1 },
      { q: "Encapsulation means?", a: [ "Inheritance", "Looping","Data hiding", "Printing"], correct: 2 },
      { q: "Inheritance means?", a: [ "Hide data", "Looping", "Printing","Reuse properties"], correct: 3 },
      { q: "Polymorphism means?", a: [ "Single form", "No form","Many forms", "Data hiding"], correct: 2 },
      { q: "Abstraction means?", a: [ "Show everything","Hide implementation", "Looping", "Printing"], correct: 1 },
      { q: "Object is?", a: ["Instance of class", "Function", "Loop", "Variable"], correct: 0 },
      { q: "Access modifier example?", a: [ "loop","private", "switch", "array"], correct: 1 },
      { q: "Public means?", a: [ "Hidden", "Protected","Accessible everywhere", "Private"], correct: 2 },
      { q: "Private means?", a: ["Accessible inside class", "Everywhere", "Outside only", "Protected"], correct: 0 },
      { q: "Protected means?", a: ["Class and subclass", "Everywhere", "Only object", "None"], correct: 0 },
      { q: "Constructor is?", a: [ "Loop","Special method", "Variable", "Operator"], correct: 1 },
      { q: "Constructor runs when?", a: [ "Program ends", "Loop runs","Object created", "Method called"], correct: 2 },
      { q: "Method is?", a: [ "Variable", "Loop", "Object","Function in class"], correct: 3 },
      { q: "Overloading means?", a: [ "Same class", "Same variable","Same name different parameters", "Inheritance"], correct: 2 },
      { q: "Overriding requires?", a: [ "Loop","Inheritance", "Array", "Variable"], correct: 1 },
      { q: "this keyword refers?", a: ["Current object", "Parent class", "Function", "Loop"], correct: 0 },
      { q: "Super keyword refers?", a: ["Parent class", "Child class", "Object", "Loop"], correct: 0 },
      { q: "Multiple objects share?", a: [ "Loop","Class", "Variable", "Array"], correct: 1 }
    ],
  },

  {
    id: 15,
    title: "Algorithm ",
    description: "Intermediate Algorithm Concepts",
    difficulty: "Intermediate",
    questions: [
      { q: "Algorithm is?", a: [ "Programming language","Step-by-step solution", "Database", "Variable"], correct: 1 },
      { q: "Time complexity measures?", a: [ "Memory size","Execution time growth", "Variables", "Loops only"], correct: 1 },
      { q: "O(n) means?", a: [ "Constant time", "Quadratic", "Linear growth","Logarithmic"], correct: 2 },
      { q: "O(1) means?", a: [ "Linear time", "Slow time", "Infinite","Constant time"], correct: 3 },
      { q: "Binary search requires?", a: [ "Unsorted array","Sorted array", "Object", "Tree"], correct: 1 },
      { q: "Binary search complexity?", a: [ "O(n)", "O(n²)", "O(log n)","O(1)"], correct: 2 },
      { q: "Linear search complexity?", a: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correct: 0 },
      { q: "Bubble sort complexity?", a: [ "O(log n)","O(n²)", "O(n)", "O(1)"], correct: 1 },
      { q: "Fastest sorting average?", a: [ "Bubble sort","Quick sort", "Linear sort", "Simple sort"], correct: 1 },
      { q: "Loop inside loop gives?", a: [ "O(n)", "O(1)","O(n²)", "O(log n)"], correct: 2 },
      { q: "Flowchart represents?", a: ["Algorithm steps", "Database", "Language", "Compiler"], correct: 0 },
      { q: "Pseudo code is?", a: [ "Programming language","Algorithm description", "Compiler", "Machine code"], correct: 1 },
      { q: "Recursion means?", a: [ "Loop", "Variable", "Function calls itself","Array"], correct: 2 },
      { q: "Base case needed for?", a: [ "Start program", "Stop recursion","Loop", "Sorting"], correct: 1 },
      { q: "Stack uses?", a: [ "FIFO", "Random", "LIFO","Sorted"], correct: 2 },
      { q: "Queue uses?", a: ["FIFO", "LIFO", "Random", "Sorted"], correct: 0 },
      { q: "Best search algorithm?", a: [ "Linear search","Binary search", "Bubble search", "Simple search"], correct: 1 },
      { q: "Worst case complexity?", a: [ "Minimum time", "Average time","Maximum time", "No time"], correct: 2 },
      { q: "Best case complexity?", a: [ "Maximum time", "Average time", "No time","Minimum time"], correct: 3 },
      { q: "Divide and conquer example?", a: ["Merge sort", "Linear search", "Bubble sort", "Simple loop"], correct: 0 }
    ],
  },

  {
    id: 16,
    title: "CSS",
    description: "Intermediate CSS Concepts",
    difficulty: "Intermediate",
    questions: [
      { q: "CSS stands for?", a: [ "Computer Style Sheets", "Creative Style System", "Cascading Style Sheets","Color Style Sheets"], correct: 2 },
      { q: "Which selector selects id?", a: [ ".id","#id", "*id", "@id"], correct: 1 },
      { q: "Which selector selects class?", a: [ "#class", "*class", "@class",".class"], correct: 3 },
      { q: "Display flex enables?", a: [ "Colors", "Fonts", "Animation","Flexible layout"], correct: 3 },
      { q: "Flex direction row means?", a: [ "Vertical layout","Horizontal layout", "Diagonal", "None"], correct: 1 },
      { q: "Position absolute means?", a: [ "Screen fixed", "Relative to parent","Normal flow", "Inline"], correct: 1 },
      { q: "Position fixed means?", a: [ "Relative parent", "Inline", "Hidden","Fixed on screen"], correct: 3 },
      { q: "Z-index controls?", a: [ "Color", "Size", "Layer order","Font"], correct: 2 },
      { q: "Margin controls?", a: [ "Inside space","Outside space", "Border", "Color"], correct: 1 },
      { q: "Padding controls?", a: [ "Outside space","Inside space", "Border", "Height"], correct: 1 },
      { q: "Grid layout uses?", a: [ "display: flex", "display: grid","display: block", "display: inline"], correct: 1 },
      { q: "Responsive design uses?", a: ["Media queries", "Loops", "Variables", "Functions"], correct: 0 },
      { q: "Hover effect selector?", a: [ ".hover",":hover", "#hover", "*hover"], correct: 1 },
      { q: "Font size property?", a: [ "text-size", "size", "font-size","fontstyle"], correct: 2 },
      { q: "Background color property?", a: [ "bgcolor", "color-bg", "backgroundstyle","background-color"], correct: 3 },
      { q: "Center text property?", a: [ "align-text", "center-text","text-align", "font-align"], correct: 2 },
      { q: "Border property controls?", a: [ "Text","Element border","Layout", "Spacing"], correct: 1 },
      { q: "Overflow hidden means?", a: ["Hide extra content", "Scroll", "Expand", "Zoom"], correct: 0 },
      { q: "Inline element example?", a: [ "div","span", "section", "header"], correct: 1 },
      { q: "Block element example?", a: [ "span", "a","div", "b"], correct: 2 }
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
      { q: "Root element of HTML?", a: ["<body>","<html>","<head>","<div>"], correct: 1 },
      { q: "Metadata goes inside?", a: ["<body>","<head>","<footer>","<section>"], correct: 1 },
      { q: "Main content goes inside?", a: ["<head>","<body>","<meta>","<link>"], correct: 1 },
      { q: "Self-closing tag?", a: ["<br>","<div>","<p>","<span>"], correct: 0 },
      { q: "HTML comment syntax?", a: ["// Comment","<!-- Comment -->","/* Comment */","# Comment"], correct: 1 },
      { q: "Which tag defines a hyperlink?", a: ["<link>","<a>","<href>","<hyper>"], correct: 1 },
      { q: "Open link in new tab?", a: ["rel='new'","open='_tab'","target='_blank'","href='new'"], correct: 2 },
      { q: "Image tag attribute for source?", a: ["href","link","ref","src"], correct: 3 },
      { q: "Image alt attribute?", a: ["Source text","Reference text","Alternative text","Hyperlink text"], correct: 2 },
      { q: "HTML table row?", a: ["<td>","<th>","<table>","<tr>"], correct: 3 },
      { q: "HTML table header?", a: ["<td>","<th>","<tr>","<thead>"], correct: 1 },
      { q: "Table data cell?", a: ["<tr>","<td>","<th>","<table>"], correct: 1 },
      { q: "Form element tag?", a: ["<input>","<form>","<button>","<label>"], correct: 1 },
      { q: "Input text field type?", a: ["text","password","number","email"], correct: 0 },
      { q: "Input password field type?", a: ["text","password","hidden","secure"], correct: 1 },
      { q: "Submit button type?", a: ["button","reset","submit","form"], correct: 2 },
      { q: "Label for input?", a: ["<span>","<div>","<input>","<label>"], correct: 3 },
      { q: "HTML5 semantic tag for header?", a: ["<head>","<header>","<top>","<section>"], correct: 1 },
      { q: "HTML5 semantic tag for footer?", a: ["<foot>","<bottom>","<footer>","<section>"], correct: 2 },
      { q: "HTML5 semantic tag for main content?", a: ["<section>","<article>","<div>","<main>"], correct: 3 },
      { q: "HTML5 semantic tag for section?", a: ["<div>","<article>","<section>","<span>"], correct: 2 },
      { q: "HTML5 semantic tag for article?", a: ["<article>","<section>","<div>","<main>"], correct: 0 },
      { q: "Meta tag for charset?", a: ["<meta type='UTF-8'>","<meta charset='UTF-8'>","<meta code='UTF-8'>","<meta encoding='UTF-8'>"], correct: 1 },
      { q: "Favicon tag?", a: ["<meta icon='favicon.ico'>","<link href='favicon.ico'>","<link rel='icon' href='favicon.ico'>","<favicon>"], correct: 2 },
      { q: "HTML5 video tag?", a: ["<media>","<video>","<movie>","<play>"], correct: 1 },
      { q: "Video autoplay attribute?", a: ["play","start","autoplay","run"], correct: 2 },
      { q: "Audio tag?", a: ["<sound>","<audio>","<music>","<media>"], correct: 1 },
      { q: "Audio autoplay?", a: ["play","start","autoplay","run"], correct: 2 },
      { q: "HTML5 canvas tag?", a: ["<draw>","<canvas>","<paint>","<svg>"], correct: 1}
    ],
  },

  {
    id: 21,
    title: "Python",
    description: "Expert Level Python Programming",
    difficulty: "Advanced",
    questions: [
      { q: "Python is?", a: ["Compiled","Interpreted","Both","None"], correct: 1 },
      { q: "Mutable data type?", a: ["tuple","list","str","int"], correct: 1 },
      { q: "Immutable data type?", a: ["list","dict","tuple","set"], correct: 2 },
      { q: "Keyword for function?", a: ["def","function","func","define"], correct: 0 },
      { q: "Keyword for class?", a: ["class","object","def","struct"], correct: 0 },
      { q: "Decorators start with?", a: ["$","@","%","&"], correct: 1 },
      { q: "Lambda defines?", a: ["Class","Loop","Variable","Anonymous function"], correct: 3 },
      { q: "List comprehension syntax?", a: ["{x for x in iterable}","[x for x in iterable]","(x for x in iterable)","<x for x in iterable>"], correct: 1 },
      { q: "Dictionary key must be?", a: ["Mutable","Immutable","Optional","Duplicate allowed"], correct: 1 },
      { q: "Global variable keyword?", a: ["public","global","static","extern"], correct: 1 },
      { q: "Local variable scope?", a: ["Class","Global","Function","Module"], correct: 2 },
      { q: "Python loop with else?", a: ["do-while","foreach","loop-until","for/while"], correct: 3 },
      { q: "Exception handling keyword?", a: ["catch","handle","try/except","throw"], correct: 2 },
      { q: "Raise exception keyword?", a: ["throw","raise","error","except"], correct: 1 },
      { q: "Pass statement?", a: ["Does nothing","Stops program","Breaks loop","Returns value"], correct: 0 },
      { q: "Break statement?", a: ["Skips iteration","Exits loop","Does nothing","Returns value"], correct: 1 },
      { q: "Continue statement?", a: ["Exits loop","Does nothing","Skips iteration","Stops program"], correct: 2 },
      { q: "With statement used for?", a: ["Looping","Condition","Function","Context management"], correct: 3 },
      { q: "Python module import?", a: ["include module","require module","import module","use module"], correct: 2 },
      { q: "Python package init file?", a: ["init.py","package.py","__init__.py","start.py"], correct: 2 },
      { q: "Python iterator method?", a: ["__next__()","__getitem__()","__len__()","__iter__()"], correct: 3 },
      { q: "Python generator uses?", a: ["return","generate","produce","yield"], correct: 3 },
      { q: "Decorators can modify?", a: ["Class","Loop","Variable","Function"], correct: 3 },
      { q: "Python type hint?", a: ["type variable","variable: type","hint variable","var type"], correct: 1 },
      { q: "F-string uses?", a: ["%","{}","f''","format()"], correct: 2 },
      { q: "Python set property?", a: ["Unique items","Duplicates allowed","Ordered","Mutable keys"], correct: 0 },
      { q: "Python dictionary comprehension?", a: ["[k:v for k,v in iterable]","{k:v for k,v in iterable}","(k:v for k,v in iterable)","<k:v for k,v in iterable>"], correct: 1 },
      { q: "Python multiple inheritance?", a: ["class C(A,B):","class C(A&B):","class C(A+B):","class C inherits A,B:"], correct: 0 },
      { q: "Python private variable?", a: ["_var","__var","var","private var"], correct: 1 },
      { q: "Python property decorator?", a: ["@decorator","@property","@func","@method"], correct: 1 }
    ],
  },

  {
    id: 22,
    title: "OOP",
    description: "Expert Level Object-Oriented Programming",
    difficulty: "Advanced",
    questions: [
      { q: "OOP stands for?", a: ["Object-Oriented Python","Object-Oriented Programming","Open Online Programming","Open Object Programming"], correct: 1 },
      { q: "Which is class blueprint?", a: ["Object","Instance","Method","Class"], correct: 3 },
      { q: "Object is?", a: ["Blueprint","Method","Instance of class","Variable"], correct: 2 },
      { q: "Encapsulation means?", a: ["Inheritance","Data hiding","Polymorphism","Abstraction"], correct: 1 },
      { q: "Inheritance allows?", a: ["Data hiding","Data binding","Overloading","Code reuse"], correct: 3 },
      { q: "Polymorphism means?", a: ["Single form","Many forms","Object hiding","Method hiding"], correct: 1 },
      { q: "Abstraction hides?", a: ["Data","Implementation details","Methods","Objects"], correct: 1 },
      { q: "Constructor used for?", a: ["Initialize object","Delete object","Call method","Return value"], correct: 0 },
      { q: "Destructor used for?", a: ["Initialize object","Create object","Modify object","Cleanup object"], correct: 3 },
      { q: "Method overriding?", a: ["Child class adds new method","Child class redefines parent method","Parent calls child method","Method overloading"], correct: 1 },
      { q: "Method overloading?", a: ["Override parent method","Delete method","Same method name, different params","Private method"], correct: 2 },
      { q: "Access modifier for private?", a: ["private","protected","public","default"], correct: 0 },
      { q: "Access modifier for public?", a: ["private","public","protected","default"], correct: 1 },
      { q: "Access modifier for protected?", a: ["private","public","protected","default"], correct: 2 },
      { q: "Getter method used for?", a: ["Access private variables","Modify variable","Delete variable","Create variable"], correct: 0 },
      { q: "Setter method used for?", a: ["Access variable","Modify private variables","Delete variable","Call method"], correct: 1 },
      { q: "Abstract class cannot?", a: ["Be inherited","Have methods","Be instantiated","Have variables"], correct: 2 },
      { q: "Interface cannot have?", a: ["Abstract method","Signature","Implementations","Concrete method"], correct: 3 },
      { q: "Multiple inheritance supported by?", a: ["Abstract class","Class","Interface","Struct"], correct: 2 },
      { q: "Composition means?", a: ["Is-a relationship","Has-a relationship","Encapsulation","Polymorphism"], correct: 1 },
      { q: "Aggregation means?", a: ["Weak has-a relationship","Strong has-a relationship","Is-a relationship","Polymorphism"], correct: 0 },
      { q: "Static method belongs to?", a: ["Object","Class","Instance","Module"], correct: 1 },
      { q: "Instance method belongs to?", a: ["Class","Object","Static","Module"], correct: 1 },
      { q: "this keyword refers to?", a: ["Class object","Parent object","Current object","Static object"], correct: 2 },
      { q: "super keyword refers to?", a: ["Child class","Current object","Static object","Parent class"], correct: 3 },
      { q: "Final class cannot?", a: ["Have methods","Have variables","Be inherited","Be instantiated"], correct: 2 },
      { q: "Final method cannot?", a: ["Be called","Be overridden","Be private","Be static"], correct: 1 },
      { q: "Encapsulated data accessed via?", a: ["Direct variable","Method overriding","Getter/Setter","Constructor"], correct: 2 },
      { q: "Polymorphism types?", a: ["Single and Multi","Static and Dynamic","Object and Class","Compile-time and Run-time"], correct: 3 },
      { q: "Abstract method has?", a: ["Signature only","Implementation","Variables","Constructor"], correct: 0 }
    ],
  },

  {
    id: 23,
    title: "Algorithm",
    description: "Expert Level Algorithms",
    difficulty: "Advanced",
    questions: [
      { q: "Time complexity of binary search?", a: ["O(n)","O(n^2)","O(1)","O(log n)"], correct: 3 },
      { q: "Space complexity of merge sort?", a: ["O(log n)","O(1)","O(n log n)","O(n)"], correct: 3 },
      { q: "Quick sort worst case complexity?", a: ["O(n log n)","O(log n)","O(n^2)","O(n)"], correct: 2 },
      { q: "Quick sort average case complexity?", a: ["O(n^2)","O(log n)","O(n)","O(n log n)"], correct: 3 },
      { q: "Which is stable sorting?", a: ["Quick sort","Heap sort","Merge sort","Selection sort"], correct: 2 },
      { q: "Which is not stable?", a: ["Merge sort","Quick sort","Bubble sort","Insertion sort"], correct: 1 },
      { q: "DFS uses?", a: ["Stack","Queue","Priority Queue","Heap"], correct: 0 },
      { q: "BFS uses?", a: ["Stack","Queue","Heap","Priority Queue"], correct: 1 },
      { q: "Dijkstra algorithm used for?", a: ["Minimum spanning tree","Shortest path","Sorting","Searching"], correct: 1 },
      { q: "Prim's algorithm used for?", a: ["SP","Sorting","MST","Graph traversal"], correct: 2 },
      { q: "Kruskal algorithm uses?", a: ["Shortest path","DFS","BFS","MST"], correct: 3 },
      { q: "Binary search works on?", a: ["Unsorted array","Sorted array","Linked list","Tree"], correct: 1 },
      { q: "Insertion sort worst case complexity?", a: ["O(n log n)","O(n^2)","O(n)","O(log n)"], correct: 1 },
      { q: "Heap sort complexity?", a: ["O(n^2)","O(n)","O(n log n)","O(log n)"], correct: 2 },
      { q: "Hash table average search?", a: ["O(1)","O(n)","O(log n)","O(n log n)"], correct: 0 },
      { q: "Hash table worst case?", a: ["O(1)","O(n)","O(log n)","O(n log n)"], correct: 1 },
      { q: "Dynamic programming used for?", a: ["Searching","Sorting","Optimization","Traversal"], correct: 2 },
      { q: "Greedy algorithm principle?", a: ["Random choice","DFS","BFS","Local optimal leads to global optimal"], correct: 3 },
      { q: "Divide and conquer example?", a: ["Bubble sort","Merge sort","Insertion sort","Linear search"], correct: 1 },
      { q: "Backtracking used for?", a: ["Constraint satisfaction","Sorting","Searching","Stack operations"], correct: 0 },
      { q: "Fibonacci DP approach?", a: ["Recursion only","Memoization","Iteration only","Backtracking"], correct: 1 },
      { q: "Topological sort used in?", a: ["Graph with cycles","Tree only","DAG","Heap"], correct: 2 },
      { q: "Shortest path negative edges?", a: ["Dijkstra","Prim","Kruskal","Bellman-Ford"], correct: 3 },
      { q: "Big-O represents?", a: ["Space complexity","Time complexity","Data type","Variable type"], correct: 1 },
      { q: "Binary search tree property?", a: ["Left>Root>Right","Left<Root<Right","Random order","All equal"], correct: 1 },
      { q: "Graph representation by adjacency matrix?", a: ["Linked list","Hash table","2D array","Queue"], correct: 2 },
      { q: "Graph representation by adjacency list?", a: ["Array of lists","2D array","Queue","Stack"], correct: 0 },
      { q: "Floyd-Warshall algorithm finds?", a: ["Minimum spanning tree","All pairs shortest path","DFS","BFS"], correct: 1 },
      { q: "Prim vs Kruskal difference?", a: ["Prim grows MST from one vertex, Kruskal edges","Prim edges, Kruskal vertices","Same","No difference"], correct: 0 },
      { q: "Complexity of linear search?", a: ["O(log n)","O(n)","O(1)","O(n^2)"], correct: 1 }
    ],
  },

  {
    id: 24,
    title: "React",
    description: "Expert Level React",
    difficulty: "Advanced",
    questions: [
      { q: "React is?", a: ["Framework","Library","Language","Database"], correct: 1 },
      { q: "JSX stands for?", a: ["Java Simple XHTML","JavaScript Extra","JavaScript XML","JSON Syntax eXtended"], correct: 2 },
      { q: "Component type with state?", a: ["Functional component","Class component","Pure component","Stateless component"], correct: 1 },
      { q: "Hook for state?", a: ["useEffect","useRef","useState","useMemo"], correct: 2 },
      { q: "Hook for side effects?", a: ["useState","useEffect","useMemo","useCallback"], correct: 1 },
      { q: "Props are?", a: ["Mutable","Local state","Read-only","Internal data"], correct: 2 },
      { q: "Key prop used for?", a: ["Styling","State","Effect","Unique list item"], correct: 3 },
      { q: "React event handler naming?", a: ["snake_case","PascalCase","camelCase","kebab-case"], correct: 2 },
      { q: "Default export keyword?", a: ["export default","export main","default export","module export"], correct: 0 },
      { q: "Import keyword?", a: ["require","import","include","using"], correct: 1 },
      { q: "React fragment syntax?", a: ["<>...</>","<Fragment>...</Fragment>","Both","None"], correct: 2 },
      { q: "useRef hook used for?", a: ["State management","Effect","Access DOM elements","Context"], correct: 2 },
      { q: "useMemo hook used for?", a: ["Effect","State","Ref","Memoize value"], correct: 3 },
      { q: "useCallback hook used for?", a: ["State","Effect","Memoize function","Ref"], correct: 2 },
      { q: "Conditional rendering?", a: ["Ternary operator","If statement in JSX","Both","None"], correct: 2 },
      { q: "React keys must be?", a: ["Unique globally","Optional","Duplicate allowed","Unique among siblings"], correct: 3 },
      { q: "Higher Order Component?", a: ["Component returning function","JSX element","Hook","Function returning component"], correct: 3 },
      { q: "Context API used for?", a: ["Local state","Refs","Global state","Effects"], correct: 2 },
      { q: "React Router used for?", a: ["State","Navigation","Effects","Context"], correct: 1 },
      { q: "React useReducer used for?", a: ["Complex state","Simple state","Effect","Ref"], correct: 0 },
      { q: "Controlled component?", a: ["Value from DOM","Value from state","Unmanaged input","Hook input"], correct: 1 },
      { q: "Uncontrolled component?", a: ["Value from state","State managed input","Value from DOM","Hook input"], correct: 2 },
      { q: "React.StrictMode purpose?", a: ["Styling","State","Routing","Detects problems"], correct: 3 },
      { q: "React.lazy used for?", a: ["State","Effect","Code splitting","Refs"], correct: 2 },
      { q: "Suspense component used with?", a: ["useState","React.lazy","useEffect","Context"], correct: 1 },
      { q: "Prop drilling means?", a: ["Passing props through many components","State management","Effect","Refs"], correct: 0 },
      { q: "Default state hook value?", a: ["Initial value","Null","Undefined","Empty array"], correct: 0 },
      { q: "React.memo used for?", a: ["State management","Prevent re-render","Effect","Routing"], correct: 1 },
      { q: "useEffect cleanup function?", a: ["State update","Ref update","Return function inside useEffect","Prop update"], correct: 2 },
      { q: "React portal used for?", a: ["State","Effect","Routing","Render outside DOM hierarchy"], correct: 3 }
    ],
  },

  {
    id: 25,
    title: "SQL",
    description: "Basic SQL Concepts",
    difficulty: "Beginner",
    questions: [
      { q: "What does SQL stand for?", a: ["Structured Query Language", "Simple Query Language", "Standard Question Language", "System Query Logic"], correct: 0 },
      { q: "Which command is used to retrieve data?", a: ["GET", "SELECT", "FETCH", "OPEN"], correct: 1 },
      { q: "Which clause is used to filter records?", a: ["WHERE", "ORDER BY", "GROUP BY", "FILTER"], correct: 0 },
      { q: "Which keyword is used to sort results?", a: ["SORT BY", "ORDER BY", "GROUP BY", "ARRANGE"], correct: 1 },
      { q: "Which command is used to insert data?", a: ["ADD", "INSERT INTO", "PUT", "CREATE"], correct: 1 },
      { q: "Which command deletes data?", a: ["REMOVE", "DELETE", "DROP", "CLEAR"], correct: 1 },
      { q: "Which command updates data?", a: ["CHANGE", "MODIFY", "UPDATE", "SET"], correct: 2 },
      { q: "Which keyword selects all columns?", a: ["ALL", "*", "EVERY", "FULL"], correct: 1 },
      { q: "Which command creates a table?", a: ["MAKE TABLE", "CREATE TABLE", "NEW TABLE", "BUILD"], correct: 1 },
      { q: "Primary key is used to?", a: ["Store duplicates", "Identify unique rows", "Delete rows", "Sort data"], correct: 1 }
    ],
  },

  {
    id: 26,
    title: "SQL",
    description: "Intermediate SQL Concepts",
    difficulty: "Intermediate",
    questions: [
      { q: "Which JOIN returns matching rows from both tables?", a: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"], correct: 0 },
      { q: "LEFT JOIN returns?", a: ["Only matching rows", "All rows from left + matches", "All rows from right", "Only unmatched rows"], correct: 1 },
      { q: "RIGHT JOIN returns?", a: ["All rows from right + matches", "All rows from left", "Only matches", "None"], correct: 0 },
      { q: "Which clause groups rows?", a: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"], correct: 1 },
      { q: "HAVING is used with?", a: ["SELECT", "GROUP BY", "ORDER BY", "INSERT"], correct: 1 },
      { q: "Difference between WHERE and HAVING?", a: ["Same", "HAVING filters grouped data", "WHERE groups data", "HAVING sorts data"], correct: 1 },
      { q: "COUNT(*) does?", a: ["Counts rows", "Counts columns", "Counts NULL", "Counts duplicates only"], correct: 0 },
      { q: "Which function returns average?", a: ["SUM()", "AVG()", "COUNT()", "TOTAL()"], correct: 1 },
      { q: "Which function returns total sum?", a: ["ADD()", "SUM()", "TOTAL()", "COUNT()"], correct: 1 },
      { q: "Which keyword removes duplicates?", a: ["UNIQUE", "DISTINCT", "REMOVE", "FILTER"], correct: 1 },
      { q: "ORDER BY default order?", a: ["DESC", "ASC", "RANDOM", "NONE"], correct: 1 },
      { q: "Which keyword sorts descending?", a: ["DOWN", "DESC", "REVERSE", "LOW"], correct: 1 },
      { q: "LIMIT is used to?", a: ["Limit rows", "Sort rows", "Delete rows", "Group rows"], correct: 0 },
      { q: "Which operator searches pattern?", a: ["MATCH", "LIKE", "SEARCH", "FIND"], correct: 1 },
      { q: "Wildcard for multiple characters?", a: ["*", "%", "_", "#"], correct: 1 },
      { q: "Wildcard for single character?", a: ["*", "%", "_", "#"], correct: 2 },
      { q: "IN operator does?", a: ["Check range", "Match multiple values", "Sort values", "Group values"], correct: 1 },
      { q: "BETWEEN is used for?", a: ["Range filtering", "Sorting", "Grouping", "Joining"], correct: 0 },
      { q: "Which clause is executed first?", a: ["SELECT", "WHERE", "FROM", "ORDER BY"], correct: 2 },
      { q: "Subquery is?", a: ["Query inside query", "Join type", "Table", "Function"], correct: 0 }
    ],
  },

  {
    id: 27,
    title: "SQL",
    description: "Advanced SQL Concepts",
    difficulty: "Advanced",
    questions: [
      { q: "Which JOIN returns all rows when there is a match in either table?", a: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], correct: 3 },
      { q: "What is a subquery?", a: ["Join type", "Constraint", "Query inside another query", "Index"], correct: 2 },
      { q: "Which clause is used to filter after aggregation?", a: ["WHERE", "GROUP BY", "HAVING", "ORDER BY"], correct: 1 },
      { q: "What does UNION do?", a: ["Combines and removes duplicates", "Combines with duplicates", "Joins tables", "Filters rows"], correct: 0 },
      { q: "UNION ALL does?", a: ["Remove duplicates", "Keep duplicates", "Sort data", "Filter data"], correct: 1 },
      { q: "Which index improves query performance?", a: ["PRIMARY", "FOREIGN", "INDEX", "CHECK"], correct: 2 },
      { q: "Which constraint ensures uniqueness?", a: ["UNIQUE", "NOT NULL", "CHECK", "DEFAULT"], correct: 3 },
      { q: "Which keyword is used for temporary result sets?", a: ["VIEW", "CTE", "TABLE", "INDEX"], correct: 0 },
      { q: "What is a VIEW?", a: ["Virtual table", "Physical table", "Index", "Constraint"], correct: 2 },
      { q: "Which clause removes duplicate rows?", a: ["UNIQUE", "DISTINCT", "GROUP BY", "HAVING"], correct: 3 },
      { q: "Which function gives rank?", a: ["ROWNUM()", "RANK()", "ORDER()", "INDEX()"], correct: 0 },
      { q: "ROW_NUMBER() does?", a: ["Assigns unique numbers", "Counts rows", "Sorts rows", "Groups rows"], correct: 1 },
      { q: "Which keyword creates index?", a: ["ADD INDEX", "CREATE INDEX", "MAKE INDEX", "NEW INDEX"], correct: 0 },
      { q: "Which constraint ensures referential integrity?", a: ["PRIMARY KEY", "FOREIGN KEY", "UNIQUE", "CHECK"], correct: 1 },
      { q: "What is normalization?", a: ["Reduce redundancy", "Increase redundancy", "Delete data", "Sort data"], correct: 2 },
      { q: "Denormalization is?", a: ["Add redundancy", "Remove redundancy", "Indexing", "Sorting"], correct: 3 },
      { q: "Which JOIN returns only matching rows?", a: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"], correct: 0 },
      { q: "Which clause sorts data?", a: ["GROUP BY", "ORDER BY", "HAVING", "WHERE"], correct: 1 },
      { q: "Which function finds max value?", a: ["MIN()", "MAX()", "AVG()", "SUM()"], correct: 2 },
      { q: "Which function finds min value?", a: ["MIN()", "MAX()", "AVG()", "SUM()"], correct: 0 },
      { q: "Which keyword limits rows?", a: ["TOP/LIMIT", "ORDER", "GROUP", "WHERE"], correct: 1 },
      { q: "Which operator checks null?", a: ["= NULL", "IS NULL", "== NULL", "NULL()"], correct: 2 },
      { q: "COALESCE does?", a: ["Return first non-null", "Return null", "Delete null", "Count null"], correct: 3 },
      { q: "Which keyword renames column?", a: ["AS", "NAME", "RENAME", "CHANGE"], correct: 0 },
      { q: "Which clause joins tables?", a: ["JOIN", "MERGE", "COMBINE", "CONNECT"], correct: 1 },
      { q: "Which JOIN returns all left rows?", a: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN"], correct: 2 },
      { q: "Which JOIN returns all right rows?", a: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN"], correct: 1 },
      { q: "Which keyword deletes table?", a: ["DELETE TABLE", "DROP TABLE", "REMOVE TABLE", "CLEAR TABLE"], correct: 2 },
      { q: "Which keyword removes all rows but keeps table?", a: ["DELETE", "DROP", "TRUNCATE", "CLEAR"], correct: 3 },
      { q: "Which clause is used in window functions?", a: ["OVER()", "GROUP()", "WINDOW()", "PARTITION()"], correct: 0 }
    ],
  },

  {
    id: 28,
    title: "PHP",
    description: "Basic PHP Concepts",
    difficulty: "Beginner",
    questions: [
      { q: "What does PHP stand for?", a: ["Private Home Page", "Personal Hypertext Processor", "PHP: Hypertext Preprocessor", "Public Hyper Processor"], correct: 2 },
      { q: "Which symbol is used to start a variable in PHP?", a: ["#", "$", "@", "&"], correct: 1 },
      { q: "Which tag starts PHP code?", a: ["<script>", "<?php", "<php>", "<code>"], correct: 1 },
      { q: "Which function outputs text?", a: ["echo()", "print()", "write()", "display()"], correct: 0 },
      { q: "Which symbol is used for comments (single line)?", a: ["//", "/* */", "#", "<!-- -->"], correct: 0 },
      { q: "Which data type is used for text?", a: ["int", "float", "string", "boolean"], correct: 2 },
      { q: "How to concatenate strings?", a: ["+", ".", "&", ","], correct: 1 },
      { q: "Which function gets string length?", a: ["count()", "size()", "strlen()", "length()"], correct: 2 },
      { q: "Which superglobal holds form data?", a: ["$_POST", "$_FORM", "$_DATA", "$_INPUT"], correct: 0 },
      { q: "Which operator compares value and type?", a: ["==", "=", "===", "!="], correct: 2 }
    ],
  },

  {
    id: 29,
    title: "PHP",
    description: "Intermediate PHP Concepts",
    difficulty: "Intermediate",
    questions: [
      { q: "Which function includes a file only once?", a: ["include()", "require()", "include_once()", "require_once()"], correct: 2 },
      { q: "What does require() do if file not found?", a: ["Warning", "Fatal error", "Ignore", "Retry"], correct: 1 },
      { q: "Which superglobal stores session data?", a: ["$_POST", "$_SESSION", "$_COOKIE", "$_GET"], correct: 1 },
      { q: "Which function starts a session?", a: ["session_start()", "start_session()", "init_session()", "session_begin()"], correct: 0 },
      { q: "Which function destroys a session?", a: ["session_destroy()", "session_remove()", "session_delete()", "unset_session()"], correct: 0 },
      { q: "Which superglobal is used for cookies?", a: ["$_SESSION", "$_POST", "$_COOKIE", "$_GET"], correct: 2 },
      { q: "Which function sets a cookie?", a: ["create_cookie()", "setcookie()", "cookie_set()", "addcookie()"], correct: 1 },
      { q: "Which array type uses key-value pairs?", a: ["Indexed", "Multidimensional", "Associative", "Numeric"], correct: 2 },
      { q: "Which loop is used to iterate arrays?", a: ["for", "while", "foreach", "loop"], correct: 2 },
      { q: "Which function checks if variable exists?", a: ["isset()", "check()", "exists()", "defined()"], correct: 0 },
      { q: "Which function removes a variable?", a: ["remove()", "unset()", "delete()", "clear()"], correct: 1 },
      { q: "Which function counts array elements?", a: ["size()", "count()", "length()", "total()"], correct: 1 },
      { q: "Which function merges arrays?", a: ["array_join()", "array_merge()", "combine()", "merge_array()"], correct: 1 },
      { q: "Which operator is used for error control?", a: ["@", "#", "!", "&"], correct: 0 },
      { q: "Which function redirects page?", a: ["redirect()", "header()", "move()", "goto()"], correct: 1 },
      { q: "Which function stops script execution?", a: ["stop()", "break()", "exit()", "end()"], correct: 2 },
      { q: "Which keyword defines a function?", a: ["func", "function", "define", "method"], correct: 1 },
      { q: "Which function returns JSON?", a: ["json_make()", "json_create()", "json_encode()", "json_convert()"], correct: 2 },
      { q: "Which function converts JSON to array/object?", a: ["json_decode()", "json_parse()", "json_read()", "json_to_array()"], correct: 0 },
      { q: "Which method is more secure for form submission?", a: ["GET", "POST", "PUT", "FETCH"], correct: 1 }
    ],
  },

  {
    id: 30,
    title: "PHP",
    description: "Advanced PHP Concepts",
    difficulty: "Advanced",
    questions: [
      { q: "Which concept allows code reuse in PHP?", a: ["Encapsulation", "Inheritance", "Polymorphism", "All"], correct: 3 },
      { q: "Which keyword is used to define a class?", a: ["define", "class", "object", "new"], correct: 1 },
      { q: "Which keyword creates object?", a: ["class", "new", "create", "init"], correct: 1 },
      { q: "Constructor method name?", a: ["init()", "__construct()", "create()", "start()"], correct: 1 },
      { q: "Destructor method name?", a: ["__destroy()", "__destruct()", "destroy()", "end()"], correct: 1 },
      { q: "Access modifier for public access?", a: ["private", "protected", "public", "global"], correct: 2 },
      { q: "Access modifier for same class only?", a: ["private", "protected", "public", "static"], correct: 0 },
      { q: "Access modifier for class + subclass?", a: ["private", "protected", "public", "global"], correct: 1 },
      { q: "Which keyword is used for inheritance?", a: ["extend", "inherits", "extends", "implement"], correct: 2 },
      { q: "Which keyword is used for interfaces?", a: ["interface", "implements", "extends", "abstract"], correct: 0 },
      { q: "Which keyword implements interface?", a: ["use", "implements", "extends", "apply"], correct: 1 },
      { q: "Abstract class keyword?", a: ["class", "interface", "abstract", "define"], correct: 2 },
      { q: "Which keyword prevents override?", a: ["const", "static", "final", "private"], correct: 2 },
      { q: "Static keyword is used for?", a: ["Object only", "Class level access", "Loop", "Condition"], correct: 1 },
      { q: "Which symbol is used for object access?", a: ["->", "::", ".", ":"], correct: 0 },
      { q: "Which operator is used for static access?", a: ["->", "::", ".", ":"], correct: 1 },
      { q: "Which function handles exceptions?", a: ["catch", "try", "throw", "handle"], correct: 1 },
      { q: "Which keyword throws exception?", a: ["throw", "catch", "error", "break"], correct: 0 },
      { q: "Which block catches exception?", a: ["try", "throw", "catch", "final"], correct: 2 },
      { q: "Which block always executes?", a: ["try", "catch", "final", "finally"], correct: 3 },
      { q: "PDO stands for?", a: ["PHP Data Object", "Personal Data Object", "PHP Database Object", "Program Data Object"], correct: 0 },
      { q: "PDO is used for?", a: ["UI", "Database connection", "Session", "Loop"], correct: 1 },
      { q: "Which method prepares SQL statement?", a: ["query()", "prepare()", "execute()", "run()"], correct: 1 },
      { q: "Which method executes prepared statement?", a: ["run()", "execute()", "prepare()", "query()"], correct: 1 },
      { q: "Which function hashes password?", a: ["md5()", "sha1()", "password_hash()", "encrypt()"], correct: 2 },
      { q: "Which function verifies password?", a: ["password_check()", "verify()", "password_verify()", "check()"], correct: 2 },
      { q: "Which function sanitizes input?", a: ["clean()", "sanitize()", "filter_input()", "secure()"], correct: 2 },
      { q: "Which header prevents caching?", a: ["cache-control", "no-cache", "header()", "expires"], correct: 0 },
      { q: "Which function uploads files?", a: ["move_uploaded_file()", "upload_file()", "file_send()", "send_file()"], correct: 0 },
      { q: "Which global handles file upload?", a: ["$_FILES", "$_UPLOAD", "$_FILE", "$_DATA"], correct: 0 }
    ],
  },

  {
    id: 31,
    title: "C Programming",
    description: "Basic C Concepts",
    difficulty: "Beginner",
    questions: [
      { q: "Who developed C language?", a: ["James Gosling", "Dennis Ritchie", "Bjarne Stroustrup", "Guido van Rossum"], correct: 1 },
      { q: "Which symbol ends a statement in C?", a: [":", ";", ".", ","], correct: 1 },
      { q: "Which function is entry point of C program?", a: ["start()", "run()", "main()", "init()"], correct: 2 },
      { q: "Which header file is used for input/output?", a: ["stdlib.h", "math.h", "conio.h", "stdio.h"], correct: 3 },
      { q: "Which keyword declares integer?", a: ["int", "float", "char", "double"], correct: 0 },
      { q: "Which format specifier is for integer?", a: ["%f", "%d", "%c", "%s"], correct: 1 },
      { q: "Which format specifier is for float?", a: ["%d", "%c", "%f", "%s"], correct: 2 },
      { q: "Which format specifier is for character?", a: ["%d", "%f", "%s", "%c"], correct: 3 },
      { q: "Which function prints output?", a: ["scanf()", "input()", "printf()", "print()"], correct: 2 },
      { q: "Which function takes input?", a: ["printf()", "input()", "scanf()", "read()"], correct: 2 }
    ], 
  },

  {
    id: 32,
    title: "C Programming",
    description: "Intermediate C Concepts",
    difficulty: "Intermediate",
    questions: [
      { q: "Which loop is guaranteed to execute at least once?", a: ["for", "while", "do...while", "loop"], correct: 2 },
      { q: "Which keyword is used to exit loop?", a: ["exit", "break", "stop", "end"], correct: 1 },
      { q: "Which keyword skips iteration?", a: ["pass", "skip", "continue", "next"], correct: 2 },
      { q: "Which function returns string length?", a: ["size()", "count()", "strlen()", "length()"], correct: 2 },
      { q: "Which header file is needed for string functions?", a: ["stdio.h", "string.h", "math.h", "stdlib.h"], correct: 1 },
      { q: "Which function copies strings?", a: ["strcat()", "strcpy()", "strcmp()", "strlen()"], correct: 1 },
      { q: "Which function compares strings?", a: ["strcpy()", "strcat()", "strcmp()", "strlen()"], correct: 2 },
      { q: "Which function concatenates strings?", a: ["strcpy()", "strcmp()", "strcat()", "strlen()"], correct: 2 },
      { q: "Which keyword is used to define function?", a: ["func", "function", "define", "return type"], correct: 3 },
      { q: "Which storage class retains value between calls?", a: ["auto", "register", "static", "extern"], correct: 2 },
      { q: "Which keyword declares external variable?", a: ["auto", "static", "extern", "register"], correct: 2 },
      { q: "Which symbol is used for pointer?", a: ["&", "*", "#", "@"], correct: 1 },
      { q: "Which operator gets address of variable?", a: ["*", "&", "%", "#"], correct: 1 },
      { q: "Which operator accesses pointer value?", a: ["&", "*", "%", "#"], correct: 1 },
      { q: "Array index starts from?", a: ["0", "1", "-1", "Depends"], correct: 0 },
      { q: "Which loop is best for known iterations?", a: ["while", "for", "do...while", "loop"], correct: 1 },
      { q: "Which statement is used in switch?", a: ["if", "case", "loop", "goto"], correct: 1 },
      { q: "Which keyword ends switch case?", a: ["stop", "end", "break", "return"], correct: 2 },
      { q: "Which function allocates memory?", a: ["alloc()", "malloc()", "memory()", "create()"], correct: 1 },
      { q: "Which function frees memory?", a: ["delete()", "remove()", "free()", "clear()"], correct: 2 }
    ],
  },

  {
    id: 33,
    title: "C Programming",
    description: "Advanced C Concepts",
    difficulty: "Advanced",
    questions: [
      { q: "Which concept allows function to call itself?", a: ["Looping", "Recursion", "Iteration", "Branching"], correct: 1 },
      { q: "Which keyword defines structure?", a: ["struct", "class", "record", "object"], correct: 0 },
      { q: "Which keyword defines union?", a: ["union", "struct", "group", "combine"], correct: 0 },
      { q: "Size of union is based on?", a: ["All members", "Largest member", "Smallest member", "Average"], correct: 1 },
      { q: "Which operator accesses struct pointer?", a: [".", "::", "->", ":"], correct: 2 },
      { q: "Which keyword is used for file handling?", a: ["file", "FILE", "open", "fopen"], correct: 1 },
      { q: "Which function opens file?", a: ["open()", "fopen()", "fileopen()", "start()"], correct: 1 },
      { q: "Which function closes file?", a: ["close()", "end()", "fclose()", "stop()"], correct: 2 },
      { q: "Which mode opens file for writing?", a: ["r", "w", "a", "rw"], correct: 1 },
      { q: "Which mode appends file?", a: ["r", "w", "a", "rw"], correct: 2 },
      { q: "Which function writes to file?", a: ["fprintf()", "fscanf()", "write()", "put()"], correct: 0 },
      { q: "Which function reads from file?", a: ["fprintf()", "fscanf()", "read()", "get()"], correct: 1 },
      { q: "Which function writes single character?", a: ["fputc()", "fgetc()", "put()", "write()"], correct: 0 },
      { q: "Which function reads single character?", a: ["fputc()", "fgetc()", "get()", "read()"], correct: 1 },
      { q: "Which keyword defines constant?", a: ["const", "define", "fixed", "static"], correct: 0 },
      { q: "Which preprocessor directive defines macro?", a: ["#include", "#define", "#macro", "#const"], correct: 1 },
      { q: "Which directive includes file?", a: ["#include", "#define", "#import", "#load"], correct: 0 },
      { q: "Which function reallocates memory?", a: ["malloc()", "calloc()", "realloc()", "free()"], correct: 2 },
      { q: "Which function allocates and initializes memory?", a: ["malloc()", "calloc()", "realloc()", "free()"], correct: 1 },
      { q: "Which keyword is used for enumeration?", a: ["enum", "list", "array", "type"], correct: 0 },
      { q: "Which operator gets size of variable?", a: ["length()", "size()", "sizeof()", "count()"], correct: 2 },
      { q: "Which storage class has global scope?", a: ["auto", "static", "extern", "register"], correct: 2 },
      { q: "Which storage class is fastest?", a: ["auto", "register", "static", "extern"], correct: 1 },
      { q: "Which keyword prevents modification?", a: ["const", "static", "final", "fixed"], correct: 0 },
      { q: "Which concept uses pointer to function?", a: ["Function pointer", "Array pointer", "Loop pointer", "Static pointer"], correct: 0 },
      { q: "Which function moves file pointer?", a: ["fmove()", "fseek()", "fshift()", "move()"], correct: 1 },
      { q: "Which function gets current file position?", a: ["ftell()", "fseek()", "fpos()", "tell()"], correct: 0 },
      { q: "Which function rewinds file?", a: ["rewind()", "reset()", "start()", "fseek()"], correct: 0 },
      { q: "Which keyword is used for dynamic memory?", a: ["malloc", "dynamic", "new", "alloc"], correct: 0 },
      { q: "Which header is needed for memory functions?", a: ["stdio.h", "stdlib.h", "string.h", "math.h"], correct: 1 }
  ],
},

  {
   id: 34,
    title: "C++",
    description: "Basic C++ Concepts",
    difficulty: "Beginner",
    questions: [
      { q: "Who developed C++?", a: ["Dennis Ritchie", "James Gosling", "Bjarne Stroustrup", "Guido van Rossum"], correct: 2 },
      { q: "Which symbol is used for output?", a: ["<<", ">>", "::", "->"], correct: 0 },
      { q: "Which function is entry point?", a: ["start()", "run()", "main()", "init()"], correct: 2 },
      { q: "Which header is used for input/output?", a: ["stdio.h", "iostream", "math.h", "stdlib.h"], correct: 1 },
      { q: "Which keyword is used for input?", a: ["cin", "cout", "scan", "input"], correct: 0 },
      { q: "Which keyword is used for output?", a: ["cin", "cout", "print", "echo"], correct: 1 },
      { q: "Which operator is used with cout?", a: [">>", "<<", "::", "->"], correct: 1 },
      { q: "Which operator is used with cin?", a: ["<<", ">>", "::", "->"], correct: 1 },
      { q: "Which symbol ends statement?", a: [":", ";", ".", ","], correct: 1 },
      { q: "Which keyword declares variable?", a: ["var", "let", "int", "define"], correct: 2 }
    ],
  },

  {
    id: 35,
    title: "C++",
    description: "Intermediate C++ Concepts",
    difficulty: "Intermediate",
    questions: [
      { q: "Which concept is core of C++?", a: ["OOP", "HTML", "CSS", "SQL"], correct: 0 },
      { q: "Which keyword defines class?", a: ["struct", "class", "object", "define"], correct: 1 },
      { q: "Which keyword creates object?", a: ["class", "new", "object", "create"], correct: 1 },
      { q: "Which function is constructor?", a: ["~class()", "class()", "init()", "start()"], correct: 1 },
      { q: "Which function is destructor?", a: ["~class()", "delete()", "destroy()", "end()"], correct: 0 },
      { q: "Which access specifier is default in class?", a: ["public", "private", "protected", "global"], correct: 1 },
      { q: "Which access specifier allows access everywhere?", a: ["private", "protected", "public", "default"], correct: 2 },
      { q: "Which keyword is used for inheritance?", a: ["extends", "inherits", "inherit", ":"], correct: 3 },
      { q: "Which symbol accesses class members?", a: [".", "->", "::", ":"], correct: 0 },
      { q: "Which keyword is used for function overloading?", a: ["override", "overload", "same name diff params", "function"], correct: 2 },
      { q: "Which concept allows multiple forms?", a: ["Encapsulation", "Polymorphism", "Inheritance", "Abstraction"], correct: 1 },
      { q: "Which keyword is used for encapsulation?", a: ["class", "struct", "private/public", "function"], correct: 2 },
      { q: "Which keyword is used for abstraction?", a: ["virtual", "abstract", "hide", "interface"], correct: 0 },
      { q: "Which keyword allows runtime polymorphism?", a: ["static", "virtual", "const", "friend"], correct: 1 },
      { q: "Which pointer refers current object?", a: ["this", "self", "current", "ptr"], correct: 0 },
      { q: "Which keyword is used for constant?", a: ["const", "final", "static", "fixed"], correct: 0 },
      { q: "Which operator is used for dynamic memory?", a: ["malloc", "alloc", "new", "create"], correct: 2 },
      { q: "Which operator frees memory?", a: ["free", "delete", "remove", "clear"], correct: 1 },
      { q: "Which operator is used for scope resolution?", a: [".", "::", "->", ":"], correct: 1 },
      { q: "Which function is used to input string?", a: ["cin", "getline()", "input()", "scan()"], correct: 1 }
    ],
  }, 
  
  {
    id: 36,
    title: "C++",
    description: "Advanced C++ Concepts",
    difficulty: "Advanced",
    questions: [
      { q: "Which feature allows generic programming?", a: ["OOP", "Templates", "Inheritance", "Encapsulation"], correct: 1 },
      { q: "Which keyword defines template?", a: ["generic", "template", "type", "class"], correct: 1 },
      { q: "Which container stores key-value pairs?", a: ["vector", "map", "set", "list"], correct: 1 },
      { q: "Which STL container stores unique values?", a: ["vector", "list", "map", "set"], correct: 3 },
      { q: "Which STL container allows duplicates?", a: ["set", "map", "vector", "unordered_set"], correct: 2 },
      { q: "Which function adds element to vector?", a: ["add()", "push_back()", "insert()", "append()"], correct: 1 },
      { q: "Which function removes last element?", a: ["pop()", "remove()", "delete()", "pop_back()"], correct: 3 },
      { q: "Which header is used for vectors?", a: ["<list>", "<map>", "<vector>", "<set>"], correct: 2 },
      { q: "Which keyword is used for exception handling?", a: ["error", "try", "handle", "catch"], correct: 1 },
      { q: "Which keyword throws exception?", a: ["throw", "catch", "try", "error"], correct: 0 },
      { q: "Which block catches exception?", a: ["try", "throw", "catch", "final"], correct: 2 },
      { q: "Which block always executes?", a: ["try", "catch", "final", "finally"], correct: 3 },
      { q: "Which keyword is used for file handling?", a: ["file", "fstream", "open", "read"], correct: 1 },
      { q: "Which class is used to write file?", a: ["ifstream", "ofstream", "fstream", "file"], correct: 1 },
      { q: "Which class is used to read file?", a: ["ifstream", "ofstream", "fstream", "file"], correct: 0 },
      { q: "Which operator is overloaded?", a: ["+", "-", "*", "All"], correct: 3 },
      { q: "Which concept hides data?", a: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"], correct: 0 },
      { q: "Which concept allows multiple forms?", a: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"], correct: 2 },
      { q: "Which keyword is used for friend function?", a: ["public", "friend", "static", "virtual"], correct: 1 },
      { q: "Which keyword prevents inheritance?", a: ["const", "static", "final", "private"], correct: 2 },
      { q: "Which keyword is used for inline function?", a: ["inline", "fast", "quick", "auto"], correct: 0 },
      { q: "Which keyword is used for namespace?", a: ["namespace", "space", "scope", "area"], correct: 0 },
      { q: "Which operator is used for pointer?", a: ["&", "*", "#", "@"], correct: 1 },
      { q: "Which operator accesses pointer member?", a: [".", "->", "::", ":"], correct: 1 },
      { q: "Which keyword is used for constant pointer?", a: ["const", "static", "fixed", "final"], correct: 0 },
      { q: "Which function gets size of container?", a: ["length()", "size()", "count()", "total()"], correct: 1 },
      { q: "Which iterator points to next element?", a: ["next()", "++it", "it++", "forward()"], correct: 1 },
      { q: "Which container is FIFO?", a: ["stack", "queue", "vector", "set"], correct: 1 },
      { q: "Which container is LIFO?", a: ["queue", "vector", "set", "stack"], correct: 3 },
      { q: "Which header is used for algorithms?", a: ["<math>", "<algo>", "<algorithm>", "<func>"], correct: 2 }
    ],
  },
];

const Quiz = ({onBack}) => {
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
        {!selectedQuiz && (
          <button className="main-back-btn" onClick={onBack}>
            ← Back Dashboard 
          </button>
        )}

        {selectedQuiz && (
          <div className="menu-icon" onClick={resetQuiz}>← Back Skill Quiz </div>
        )}
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
            <div
              className={`timer ${
                timer <= 30 ? "danger" : timer <= 60 ? "warning" : ""
              }`}
            >
              ⏱ {String(Math.floor(timer / 60)).padStart(2, "0")}:
              {String(timer % 60).padStart(2, "0")}
            </div>

            <h2>{selectedQuiz.title}</h2>

            <p>Question {currentQ + 1} of {totalQuestions}</p>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
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