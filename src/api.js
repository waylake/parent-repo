export const myRequest = async (nctid) => {
  const response = await fetch(`http://localhost:5000/api`, {
    method: 'POST',
    body: 'hi',
  });
  const body = await response.json();
  return body;
};