import { PageToRender, pageToRender } from '../storage/pageToRender';

export default function RouterWrapper(props: { pageIDs: PageToRender[]; children: any }) {
    // Todo Make it display a warning when no wrapper with the current pageID is found
    return props.pageIDs.includes(pageToRender.value) ? props.children : null;
}
