
  export async function POST(req) {
    const { message } = await req.json();
    const ollamaRes = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        { model: "deepseek-coder-v2:latest",
            prompt: message,
            stream: false 
        }),
    });
  
    if (!ollamaRes.ok) {
      return new Response(JSON.stringify({ message: "Error generating response" }), { status: 500 });
    }
  
    const data = await ollamaRes.json();
    return new Response(JSON.stringify({ message: data.response }), { headers: { "Content-Type": "application/json" } });
  }
  