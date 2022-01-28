const lc = {
    storeUser: function(token,user){
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('user', JSON.stringify(user));
        return true;
    },
    recieveUser: function(){
        let token = JSON.parse(localStorage.getItem("token"));
        if (token != null) {
            return token;
        }
        return null
    }
}

export default lc;