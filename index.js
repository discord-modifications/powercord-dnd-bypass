const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModule } = require('powercord/webpack');

const { getChannelId } = getModule(['getLastSelectedChannelId'], false);
const Notifications = getModule(['makeTextChatNotification'], false);
const { getChannel } = getModule(['hasChannel'], false);

const Settings = require('./components/Settings.jsx');

module.exports = class DNDBypass extends Plugin {
   startPlugin() {
      this.loadStylesheet('style.css');

      powercord.api.settings.registerSettings('dnd-bypass', {
         category: this.entityID,
         label: 'DND Bypass',
         render: Settings
      });

      inject('db-notifications', Notifications, 'shouldNotify', ([msg, channelId], res) => {
         if (this.settings.get('friends', []).includes(msg.author.id)) {
            // Check if were already looking at the channel
            if (document.hasFocus() && getChannelId() == channelId) {
               return false;
            }

            // Guilds
            if (msg.guild_id && !this.settings.get('guilds', false)) {
               return false;
            }

            // Groups
            if (getChannel(msg.channel_id)?.type == 3 && !!this.settings.get('groups', false)) {
               return false;
            }

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
