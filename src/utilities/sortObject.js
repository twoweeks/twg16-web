const sortObject = (object, by) => {
    let tmp = [...object];
    tmp.sort((a, b) => {
        if (a[by] < b[by]) {
            return -1;
        }
        if (a[by] > b[by]) {
            return 1;
        }
        return 0;
    });
    return tmp;
};

export default sortObject;
