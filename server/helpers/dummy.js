const res = [
  {
    chat: [
      {
        prompt: "Explain quantum computing in simple terms",
        content:
          "Quantum computing is a type of computing that uses principles of quantum mechanics to store and process information. In classic computing, the basic unit of information is a bit, which can represent either a 0 or a 1. In quantum computing, the basic unit of information is a qubit, which can represent 0, 1, or both at the same time thanks to a phenomenon called superposition. This allows quantum computers to perform certain calculations much faster than traditional computers.\n\nFollow-up questions:\n1. How does quantum entanglement play a role in quantum computing?\n2. What are some potential applications of quantum computing?\n3. What are the challenges or limitations of quantum computing technology at the moment?",
      },
      { prompt: "hiii", content: "Hello! How can I assist you today?" },
    ],
  }
];

console.log(res[0].chat[0].prompt)