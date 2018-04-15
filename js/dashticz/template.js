var Dashticz = Dashticz || {};

Dashticz.Template = (function() {
    /**
     * @param dashticz The Dashticz class
     * @constructor
     */
    var Template = function(dashticz) {
        this.dashticz = dashticz;
        this.ractiveCache = {};
        this.templateCache = {};
    };

    /**
     * This function will fetch the template, setup a Ractive object and inject it in the given element id
     * By default, the ractive object is cached & re-used if possible (unique by element id)
     *
     * @param {string} tpl
     * @param {string} id
     * @param {Object} data
     * @param {Object=} extendedSettings Settings are:
     *  - useCache: true/false (default true) -- If enabled, ractive cache is re-used
     * @returns {Deferred} A deferred Promise, the .done() function will receive the Ractive object
     */
    Template.prototype.injectTemplateToElementById = function(tpl, id, data, extendedSettings) {
        var dfd = new $.Deferred();
        var settings = $.extend(true, {
            el: '#' + id,
            data: data,
            useCache: true
        }, extendedSettings);

        if(settings.useCache === true && this.ractiveCache.hasOwnProperty(id)) {
            this.ractiveCache[id].set(data);

            dfd.resolve(this.ractiveCache[id]);
            return dfd.promise();
        }

        this.getTemplate(tpl)
            .done(function(source) {
                settings.template = source;

                var ractive = new Ractive(settings);

                this.ractiveCache[id] = ractive;

                dfd.resolve(ractive);
            }.bind(this));

        return dfd.promise();
    };

    /**
     * This function only gets the template source
     *
     * @param {string} tplFile
     * @param {bool} useCache true/false (default true) -- If enabled, the template cache is re-used
     * @returns {Deferred} A deferred Promise, the .done() will receive the raw source of the template
     */
    Template.prototype.getTemplate = function(tplFile, useCache) {
        var dfd = new $.Deferred();
        if(typeof useCache === 'undefined') useCache = true;

        if(useCache === true && this.templateCache.hasOwnProperty(tplFile)) {
            dfd.resolve(this.templateCache[tplFile]);
            return dfd.promise();
        }

        $.ajax({
            url: './templates/ractive/' + tplFile
        }).done(function(source)    {
            this.templateCache[tplFile] = source;
            dfd.resolve(source);
        }.bind(this));

        return dfd.promise();
    };

    return Template;
})();