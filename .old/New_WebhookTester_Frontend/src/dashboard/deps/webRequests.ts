async function fetchData() {
    const apiCall = await fetch( 'http://localhost:3050/webhook', {
        method: 'GET',
        headers: {
            "authkey": "1234567890",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    } )
    const res = await apiCall.json();
    console.log(res)
};

export {
    fetchData
}