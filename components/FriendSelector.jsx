const { React } = require('powercord/webpack');
const { getModule, getModuleByDisplayName } = require('powercord/webpack');

module.exports = class Settings extends React.Component {
   constructor(props) {
      super(props);

      const get = props.getSetting;

      this.state = {
         friendsQuery: '',
         friends: get('friends', [])
      };
   }

   async componentDidMount() {
      this.setState({
         VerticalScroller: (await getModule(['AdvancedScrollerThin'])).AdvancedScrollerThin,
         Flex: await getModuleByDisplayName('Flex'),
         Text: await getModuleByDisplayName('Text'),
         PopoutList: await getModuleByDisplayName('PopoutList'),
         playSound: (await getModule(['playSound'])).playSound,
         getUser: (await getModule(['getUser', 'getUsers'])).getUser,
         getRelationships: (await getModule(['getRelationships'])).getRelationships,
         classes: {
            auditLogsFilter: (await getModule(['guildSettingsAuditLogsUserFilterPopout'])).guildSettingsAuditLogsUserFilterPopout,
            elevationBorderHigh: (await getModule(['elevationBorderHigh'])).elevationBorderHigh,
            alignCenter: (await getModule(['alignCenter'])).alignCenter,
            scroller: (await getModule(['listWrapper', 'scroller'])).scroller,
            discriminator: (await getModule(['discriminator', 'avatar', 'scroller'])).discriminator,
            userText: (await getModule(['discriminator', 'avatar', 'scroller'])).userText,
            popoutList: getModule(['popoutList'], false).popoutList
         }
      });
   }

   render() {
      if (!this.state.VerticalScroller) return null;
      const { VerticalScroller, Flex, PopoutList, getUser, getRelationships } = this.state;
      const PopoutListSearchBar = PopoutList.prototype.constructor.SearchBar;
      const PopoutListDivider = PopoutList.prototype.constructor.Divider;
      const FlexChild = Flex.prototype.constructor.Child;
      const SelectableItem = PopoutList.prototype.constructor.Item;

      const relationships = getRelationships();
      let friends = Object.keys(relationships).filter(relation => relationships[relation] === 1);
      friends = [...this.state.friends.filter(f => !friends.includes(f)), ...friends];

      return (
         <div>
            <div
               className={`db-user-settings ${this.state.classes.popoutList} ${this.state.classes.auditLogsFilter} ${this.state.classes.elevationBorderHigh}`}
               popoutKey='db-users'
            >
               <PopoutListSearchBar
                  autoFocus={true}
                  placeholder='Search friends'
                  query={this.state.friendsQuery || ''}
                  onChange={(e) => this.setState({ friendsQuery: e })}
                  onClear={() => this.setState({ friendsQuery: '' })}
               />
               <PopoutListDivider />
               <VerticalScroller className={`${this.state.classes.scroller} db-friend-scroller`}>
                  {friends
                     .map(getUser)
                     .filter(user => this.state.friendsQuery ? user?.username?.toLowerCase().includes(this.state.friendsQuery.toLowerCase()) : true)
                     .map((user, i) =>
                        user && <SelectableItem className='db-friend-item' id={user.id} key={i.toString()} selected={this.state.friends.includes(user.id)} onClick={(e) => {
                           if (!e.selected) {
                              this.state.friends.push(e.id);
                              this._set('friends', this.state.friends);
                           } else {
                              this._set('friends', this.state.friends.filter(a => a !== e.id));
                           }
                        }}>
                           <Flex align={this.state.classes.alignCenter} basis='auto' grow={1} shrink={1}>
                              <div>
                                 <Flex align={this.state.classes.alignCenter} basis='auto' grow={1} shrink={1}>
                                    <FlexChild key='avatar' basis='auto' grow={0} shrink={0} wrap={false}>
                                       <img
                                          src={!user.avatar ? `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png` : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                                          width={32}
                                          height={32}
                                          style={{ borderRadius: '360px' }}
                                       />
                                    </FlexChild>
                                    <FlexChild key='user-text' basis='auto' grow={1} shrink={1} wrap={false}>
                                       <div className={this.state.classes.userText}>
                                          <span className={this.state.classes.userText}>{user.username}</span>
                                          <span className={this.state.classes.discriminator}>#{user.discriminator}</span>
                                       </div>
                                    </FlexChild>
                                 </Flex>
                              </div>
                           </Flex>
                        </SelectableItem>
                     ).sort((a, b) => {
                        const firstName = a.props.children.props.children.props.children.props.children[1].props.children.props.children[0].props.children;
                        const secondName = b.props.children.props.children.props.children.props.children[1].props.children.props.children[0].props.children;
                        return firstName.localeCompare(secondName);
                     })
                  }
               </VerticalScroller>
            </div>
         </div>
      );
   }

   _set(key, value = !this.state[key], defaultValue) {
      if (!value && defaultValue) {
         value = defaultValue;
      }

      this.props.updateSetting(key, value);
      this.setState({ [key]: value });
   }
};
