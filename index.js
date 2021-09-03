const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModule } = require('powercord/webpack');

const { getChannel } = getModule(['getChannel'], false);
const Notifications = getModule(['makeTextChatNotification'], false);

const Settings = require('./components/Settings.jsx');

module.exports = class DNDBypass extends Plugin {
   startPlugin() {
      this.loadStylesheet('style.css');

      powercord.api.settings.registerSettings('dnd-bypass', {
         category: this.entityID,
         label: 'DND Bypass',
         render: Settings
      });

      inject('db-notifications', Notifications, 'shouldNotify', ([msg], res) => {
         if (!this.settings.get('friends', []).includes(msg.author.id)) {
            return res;
         }

         // Guilds
         if (msg.guild_id && this.settings.get('guilds', false)) {
            return true;
         }

         // Groups
         if (getChannel(msg.channel_id)?.type == 3 && this.settings.get('groups', false)) {
            return true;
         }

         return res;
      });
   }

   pluginWillUnload() {
      uninject('db-notifications');
      powercord.api.settings.unregisterSettings('dnd-bypass');
   }
};