import { PageToRender, pageToRender } from '../storage/pageToRender';

export default function Router(props: { pageID: PageToRender; children: any }) {
    return pageToRender.value === props.pageID ? props.children : null;
}
