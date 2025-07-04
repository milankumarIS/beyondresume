export function payWithUPI(totalPrice:any) {
    const tid = getRandomString();
    const orderId = getRandomString();
    const UPI_ID = 'kumarmanas17@ybl';
    const UPI_NAME = 'Daily Life';
    const UPI_TXN_NOTE = 'DAILYLIFE PAYMENT';
    let uri = `upi://pay?pa=${UPI_ID}&pn=${UPI_NAME}&tid=${tid}&am=${totalPrice}&cu=INR&tn=${UPI_TXN_NOTE}&tr=${orderId}`;
    // uri = uri.replace(' ', '+');
    (window as any).plugins.intentShim.startActivity(
        {
            action: (window as any).plugins.intentShim.ACTION_VIEW,
            url: uri,
            requestCode: 1
        }, (intent: any) => {
            if (intent.extras.requestCode === 1 && intent.extras.resultCode === (window as any).plugins.intentShim.RESULT_OK && intent.extras.Status && (((intent.extras.Status as string).toLowerCase()) === ('success'))) {
                alert("Payment Success");
            }
            else if (intent.extras.requestCode === 1 && intent.extras.resultCode === (window as any).plugins.intentShim.RESULT_OK && intent.extras.Status && (((intent.extras.Status as string).toLowerCase()) === ('failed'))) {
                alert("Payment Failed ");
            }
        }, (err: any) => {
            alert('error ' + err);
        });
}

export function payWithUPIUri(totalPrice: any) {
    const tid = getRandomString();
    const orderId = getRandomString();
    const UPI_ID = 'kumarmanas17@ybl';
    const UPI_NAME = 'Daily Life';
    const UPI_TXN_NOTE = 'DAILYLIFE PAYMENT';
    let uri = `upi://pay?pa=${UPI_ID}&pn=${UPI_NAME}&tid=${tid}&am=${totalPrice}&cu=INR&tn=${UPI_TXN_NOTE}&tr=${orderId}`;
    return { uri, orderId,totalPrice };
}
function getRandomString() {
    const len = 10;
    const arr = '1234567890asdfghjklqwertyuiopzxcvbnmASDFGHJKLQWERTYUIOPZXCVBNM';
    let ans = '';
    for (let i = len; i > 0; i--) {
        ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
}


export function getRandomNumber() {
    const len = 6;
    const arr = '1234567890';
    let ans = '';
    for (let i = len; i > 0; i--) {
        ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
}