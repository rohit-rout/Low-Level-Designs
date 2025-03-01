var User = /** @class */ (function () {
    function User(id, type) {
        this.id = id;
        this.type = type;
    }
    User.prototype.getProfile = function () {
        console.log('user id is', this === null || this === void 0 ? void 0 : this.id);
    };
    return User;
}());
export { User };
