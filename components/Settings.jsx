const { React } = require('powercord/webpack');
const { SwitchItem } = require('powercord/components/settings');

const FriendSelector = require('./FriendSelector');

module.exports = class Settings extends React.Component {
   constructor(props) {
      super(props);
   }

   render() {
      const { getSetting, toggleSetting, updateSetting } = this.props;

      return (
         <div>
            <SwitchItem
               note={'Bypasses DND or any type of server mute/channel mute when that person speaks in a server.'}
               value={getSetting('guilds', false)}
               onChange={() => toggleSetting('guilds', false)}
            >
               Notify if user speaks in server
            </SwitchItem>
            <SwitchItem
               note={'Bypasses DND or any type of channel mute when that person speaks in a group chat.'}
               value={getSetting('groups', false)}
               onChange={() => toggleSetting('groups', false)}
            >
               Notify if user speaks in group chats
            </SwitchItem>
            <FriendSelector {...this.props} />
         </div>
      );
   }
};
