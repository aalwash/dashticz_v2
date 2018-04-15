var instanceDashticz = null; // to keep it a Singleton

/**
 * This constructor will function as a Singleton
 *
 * @param settings
 * @returns {*}
 * @constructor
 */
function Dashticz(settings) {
    if(!(this instanceof Dashticz)) return new Dashticz(settings);
    if(instanceDashticz instanceof Dashticz) return instanceDashticz; // already initialized

    instanceDashticz = this;
    this.modules = {};
}

/**
 * Alias for returning the Template module
 *
 * @returns {*}
 * @constructor
 */
Dashticz.prototype.Template = function() {
    return this.module('template');
};

/**
 * Make a new instance of the given module, if already initialized before, return that one
 *
 * @param module
 * @returns {*}
 */
Dashticz.prototype.module = function(module) {
    module = module[0].toUpperCase() + module.substr(1);

    if(this.modules[module] === undefined) {
        this.modules[module] = new window['Dashticz'][module](this);
    }

    return this.modules[module];
};