import { PageToRender, pageToRender } from '../storage/pageToRender';

export default function RouterWrapper(props: { pageIDs: PageToRender[]; children: any }) {
    return props.pageIDs.includes(pageToRender.value) ? props.children : null;
}
