const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModule } = require('powercord/webpack');
const Settings = require('./Settings.jsx');
const Notifications = getModule(['makeTextChatNotification'], false);

module.exports = class DNDBypass extends Plugin {
   startPlugin() {
      this.loadStylesheet('style.css');

      powercord.api.settings.registerSettings('dnd-bypass', {
         category: this.entityID,
         label: 'DND Bypass',
         render: Settings
      });

      inject('db-notifications', Notifications, 'shouldNotify', ([msg], res) => {
         if (
            !msg.guild_id &&
            this.settings.get('friends', []).includes(msg.author.id)
         ) return true;
         return res;
      });
   }

   pluginWillUnload() {
      uninject('db-notifications');
      powercord.api.settings.unregisterSettings('dnd-bypass');
   }
};