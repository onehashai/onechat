import { addClass, removeClass, toggleClass, wootOn } from './DOMHelpers';
import { IFrameHelper } from './IFrameHelper';
import { isExpandedView } from './settingsHelper';

export const bubbleImg =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAXEAAAFxAGbebUAAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAADbxJREFUeJztnXt0VdWdxz+/fW7uDQSQt0IAEZCwBHmIw0NQgSIFCqjjC1ScVde0djELBGwHBVlNlxYVWqeFcWYxq13OTBkUO46WhwyKBAsFlOXQVnkEgZa3yjsJJrn3nPObPyAYQkJu9jn3hhv8/HXvufv33Tvnm332Pnvvs49whVM0oEerhBPJMzg9VOku4ncXlXYq5AA5QAsgp9HUE1EFNeAqeCK4qhSJ4YDv6w7EbImXsf6a7x76rJ7/pMsi9V2AqpQM7HWta+QOHzNS0LuAG5KJazT1RJI5qK/IEZD1Tkxfid53eIt9acPnijCkaEjvPF+Z7Cv3C+TZaCRvSFWkXFW3iqPPZU888q6lSGjUmyFnBvds6WEmgUwWGBhUz96QrxGhxPd1VbbjzJGJB/cGFrQpQ7ozLBnY69q4ODNEdCrQOCzdMAy5gIIY3el6zt/lPHpwa3jCtZM2Q04N6tsZ/BkqfF8gO2z9UA2phCj7VPQH2Q8feS8lGVTNL9UZHBuS1zSi0XxUpgGRVOWTKkMqUOSj7Jz4BLn7yy9SmY9JpfjJQb3HR/zYp6jMJIVmpANBB8TPRg6Xvpa7OLX5pIATf9Oro0TkV4KMSoV+daS6hlRG0eO+74xNRfsSeg05PejmkSZitqbTjHQjSOuI8beU/leHH4evHRI6bFjkdPzksyhzSfGlsDrSWUMuRv8UK253mzzx8VdhqIVy4opv79fmdPmpD1B+HJZm5iB94k2/OFr2em73MNQCn7xTt/W7PuF6G0BvC6NAmYiizfDlk/ibuYOCagUy5MTAfjeh3kbb4Y6GhUb9cv2D+3ruA0FUrA05MaT3IGO8jUCHIAUIQDGwH9gOfKToWaAcwUXQ+imSmITPstLXOj5urWATdPK23r1E+T3nhr5TjQI7EF2Hmj/6eLuyPLew2Ue7LtuKn3m1w42RmI4w6EAjpr9CHqqxNJQXBTVq7o09cvB3dY2tsyGnBvXtjPgbgdy6xtYBT5Q1Pro0qrq2yYefhnJ3XLL0ht6OiU/B1/sEaR2G5mXwTIyhdR3er5Mhxbf3a+N63kaUUHoU1XBAYFHc9Za03br98xTlAUDJq537ZsXizysyGnBSk4vEMXpz9sTDu5OOSDah9u+fdTrqrk9Rb+ozkBebF7lLZPv2eAr0a0Tf6NmkzC16RfAnAVlh6wtyJtru0HUynLLk0ifJycG9Fwj80L5o1XJWRJ+7Jtrq57J+vRuydp3QArLLj3ZYiug9aLhDSqpsbvTI4aT+kZPK+OTgPuMEXZ5s+mRQYZnnZM1os+Hjo2FphsHZNzr1d1zvbULuPaqYuY0mHXy+tnS1nuATA3t3MA7bUMJqBEtFdHrzTZ/8W0h6KaH0tdzFKN8P6z9QwHcjzoCcBw98fLl0td6HiNFfh2eG7vB959Yr3QyARpMOP5HlmHtBQmnTFIxxvdW1pbusIacH9XkwrFFbUbY4XuKOVh9u2xGGXjqIPHTw7Zjr9BCkKAw9gTblS9u9UEua6jk2JK9pxI/tJJz7jRUl5DzUcfPm0hC00o6+061Z2enSnQLtQ5DzYjmJ3JpmHmusIRGN5hOGGcLy5rGWf5upZgDI2D1F2e0Od0UI4wbViZdmvV1jXtUdPD305i7qSSHBp103lJDz7Uw2ozK6on3reJHsU6FpUC1fdEjjSUc2VT1ebQ3xPTOLwGboDmJmQkMxA0DGHzkedUw/JHhDb9RUOzd/SQ05MbB3B2PYAwQZiDvr+86ATGrA64K7rOM9Cdd/S4L0iRU8E7klZ9L+bZUPX1JDjOGHBDMDlH9oqGbAud4XRn4TSETAqHdJ9/8ij4sG9GjlOdEDBFhRqMKylpv+PNE2PpMoXZp7OEjPS4FsN9JFHtv/l4pjF9UQ18maSLDlncW+ylMB4jMK3zf3gP1kmABlEe+nlY9VuWTJZFvx88xtvflPhwNqZAw5jx7cKug7QTSM6riLvld8KBrSOy/gKvTPmsdavhIgPiOJFrd7UCBhG69C07Kl7e+q+H7BEF8JWDvkxfoeQq8Pzq3HkjeCaCjm2YrPlQ25P4DmgeZF7pIghcpkos2zpwCebbzI11cmA3B8cJ/cIEt5BBale6bvSkLG7ikS/DXWAqqxklc794XzhjjCiADlceOud9XWjgpciT5be6qaiWa7fw8VlyzfH24rJMq7qV6QkAnkTNq/TcB6gbGv/kioMETEuob46FLb2IaGj75lHSzSFcCcGdyzJXC9pYxGVddaF6KB4ZVH7bv9SkRf79jVuEiPAGXYEdYitoZAk+/+9Y9BpnzLlDuNEQmwUFoK7GMbLEkvirsE9QYbxdjXEPH/zzq2gaKI/TlR6WkkwLJQX7XQOvMGio/3oXWwcL0R1ets47M89xtDquBFWWcba0SaGBWaWMafqe2RgKuRZvcf2WX7fIqqRg1YT9ifsYxr+Ci+VZwQCWJIsWXcVYBYjXqLYgzYXbJEvzGkJgS1mh9RxURuHb4Q61nILdZDYA2a2Jd9t2M32VduBEqsctXgi8UaMM0s44qNonaXHpFvDKkZ63bZYN046zWWmV4NWJ4bDWII1/R4Zm0ry9iGy4JRbbGuIVJsAOvJpUSQcbCGipMVZLD2cyMBRicVk6rHozMX0QCGaKHxVezHo0T722feQDFyi3WssNuI8awNEWWYdeYNFbWfDkd1lynPSuyyFhBu6vyjAuvR4gbHogntIcAlKyq7zaH80SeBv1pKSCQid9We7CrBdYM8ILuPKatOGQBBrMfw1ejDAQrRsDDySIDo9+HCUlK1nxtXHdV9zvup3BkoM1g0oT2K/eCenvPg3MpFN2FdQ0CMp843tcTzJmO/q5ASpQAqPUHVbXbBTgXbG71D2dFjXbfnP3h1ru9dOCaGb/Zi/xj5dqav6gWVVr+r8N8BitShPN7msQDxmY1nHifIM/0qF87914b4XqCHGBWeHpZfkNHbiVuR/0AU4R8DKChqLixWv2DIvhdG7lawX8ICXQ8ldFqA+MykxdmZQOcACpuYuXxPxZeLnjE0EKyWqORfVT2un9/dEZU5wUT0onN+kSFl0fLXQIJsmd3UVfOLAPGZhZNYiOWahPOcJXrx43AXGXIof/RJUQ20l5XA/V1mr7PetzZj+OW4H4DcE0hD+VemrDpV+dAlOzkkxJkPyW3YWBOCvHLDrHV9gmhc0bw89mZUXw6oUkbE+aeqBy8xZP+8O44C/xEws2zHkdc7Pb0hHRstp5d/vrcVRt4EGgVU+hVTlx+perDa3YAixrxEgGevARR6ZBl3Rfv8FaG9+KveWTy+MW5iJXBjQKU4YhZU90O1hhQ+f+dfQMNonIc0TjRZ1iDuTxb3z6LU/y1o4DcgAD/jyRUHqvuhxh3lSqNn8zm32X0gVBl3KMFbGV1TFo9vTNl1bwFjQ1A7QCIxr6YfazTkSP74r0TD2ThZlXGN400LuucXpHq/9fD5l++0oNR/F+U7ISlO5Ufvnq3px1q34Oo6p2A1yuiQClOojnlg33N3fhKSXmpZOK4Pvv6W4G3GeWQl01eOv1yK2vftTfA94Hg4BSJPPP+jLrMLngxJL3X8Ytxj+LqJ8Mz4Esc8UWuqZKS6zl4/BnRVsumTQ/5HXH1yz/zhh8LTDIFfju+E7y9EuDtEVR9jxjBtRa0vP076BHebXfCiwqxg5bok+68EXRCLHptX73Mpi/tnUdZuCqrPYb82twbkeaavnJtUymQlh+UXRA7GKQCGWper5mLsQ/yXsrOO/3vajVk4JoZnHj8/hN45dH3VDzjz1Ujyk9u6qk6XoO75Ba39OBsCzCzWxiFUF0U8d0nh/FGX3MWGysvjcjH6KDCV1L0taAe+ezsz15xMNqDObUKXWe91EifyB1L7MjBPRd4XX5dGvMR7oZmzaEJ7fP/boA+jjCCl71zUg3hZQ3jqdwfrEmXVSHebu64nnvm9oi1t4i3YqUiBQbf5wi7jO4V7Xrjj2GUjFo5pg2t6IJqHkVvOrwhJ1+Lwkxj/dqatrvNWuda9phufWTdQxbyTRlOqUgycBikWKNlz7QJQmoA2BWlBsHmKIJwEHcv0d6xmXwN1Y7s9s/YmFed/gY5BdMJgb9uf1XcRAI6CM5rpy/9sKxDoGrrnhZE7Im5iEEpm3Hmnlp2IGRTEDAihUSucP+qIE2MEsCGoVsai+gG+O7SmEdy6EEovY3f+8OMdo4wQ+Amo3S4GmYmCLKTxF3fVpWt7OUJ9PRxAl9nrviUiS1DS+phCPbQhx1H/MWasrvW9UnUh9H74vnkj3nfwb0Uk0BbcVzayEsfpE7YZkIIaUpluc9aPV9WFpGJIogppqiGHQWYzfeV/piqDFN6pwp6fDluRE4/3EngprNfP1RNxYB6NTPdUmgEpriGV6TLrvU5isp5C9HsEX7FxCSmqIXFUluF4P2Ha6r2pyKAqaTOkgq75a9pKPDpFkRmgtnuCXELIhpwF+TU+85m5Mq2v30i7IRV0enpDi4jjPiQqk8N4A3UIhiiwGZHfkKXLqq4oTBf1Zkhlujz7wY1G9VH19T6EnjYaAQz5FJU3UbOk8ir0+uKKMKQyXfPXtJVE7E5VRgJDQW9KJq4OhhwFNiKsxY2sruvweKq54gypSqenN7SIOm6eKj0U7S6YPNBrRWiiKk0Fmis02dt2AZzb++s0SjFCCcjniL8bpBDVXURld31dipLl/wELtrl68x7sAgAAAABJRU5ErkJggg==';

export const body = document.getElementsByTagName('body')[0];
export const widgetHolder = document.createElement('div');

export const bubbleHolder = document.createElement('div');
export const chatBubble = document.createElement('button');
export const closeBubble = document.createElement('button');
export const notificationBubble = document.createElement('span');

export const setBubbleText = bubbleText => {
  if (isExpandedView(window.$chatwoot.type)) {
    const textNode = document.getElementById('woot-widget--expanded__text');
    textNode.innerHTML = bubbleText;
  }
};

export const createBubbleIcon = ({ className, src, target }) => {
  let bubbleClassName = `${className} woot-elements--${window.$chatwoot.position}`;
  const bubbleIcon = document.createElement('img');
  bubbleIcon.src = src;
  bubbleIcon.alt = 'bubble-icon';
  target.appendChild(bubbleIcon);

  if (isExpandedView(window.$chatwoot.type)) {
    const textNode = document.createElement('div');
    textNode.id = 'woot-widget--expanded__text';
    textNode.innerHTML = '';
    target.appendChild(textNode);
    bubbleClassName += ' woot-widget--expanded';
  }

  target.className = bubbleClassName;
  return target;
};

export const createBubbleHolder = hideMessageBubble => {
  if (hideMessageBubble) {
    addClass(bubbleHolder, 'woot-hidden');
  }
  addClass(bubbleHolder, 'woot--bubble-holder');
  body.appendChild(bubbleHolder);
};

export const createNotificationBubble = () => {
  addClass(notificationBubble, 'woot--notification');
  return notificationBubble;
};

export const onBubbleClick = (props = {}) => {
  const { toggleValue } = props;
  const { isOpen } = window.$chatwoot;
  if (isOpen !== toggleValue) {
    const newIsOpen = toggleValue === undefined ? !isOpen : toggleValue;
    window.$chatwoot.isOpen = newIsOpen;

    toggleClass(chatBubble, 'woot--hide');
    toggleClass(closeBubble, 'woot--hide');
    toggleClass(widgetHolder, 'woot--hide');
    IFrameHelper.events.onBubbleToggle(newIsOpen);

    if (!newIsOpen) {
      chatBubble.focus();
    }
  }
};

export const onClickChatBubble = () => {
  wootOn(bubbleHolder, 'click', onBubbleClick);
};

export const addUnreadClass = () => {
  const holderEl = document.querySelector('.woot-widget-holder');
  addClass(holderEl, 'has-unread-view');
};

export const removeUnreadClass = () => {
  const holderEl = document.querySelector('.woot-widget-holder');
  removeClass(holderEl, 'has-unread-view');
};
