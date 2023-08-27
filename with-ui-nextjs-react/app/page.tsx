"use client"
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  Snippet,
  Configure,
  SearchBoxProps
} from "react-instantsearch-hooks-web";
import Client from "@searchkit/instantsearch-client";

const searchClient = Client({
  url: "/api/search",
});
//새로운 날짜가 등장했는지 확인하는 용도
let date_set = new Set<String>();
//이전에 view에 보여줬던 오브젝트가 있는지 확인하는 용도
let object_set = new Set<String>();

// dict들 초기화 <- 검색할때마다 view를 새롭게 보여주기 위해
const init_dict = () => { 
  console.log('init')
  date_set.clear();
  object_set.clear();
}

// user_id 에 맞는 사진만 필터링 해서 가져옴
const user_id = 2;
const default_filter = () => {
  return "user_id:" + user_id;
}
const date_filter = (start:string,end:string) => {
  return default_filter() + ` AND snapped_at:[${start} TO ${end}]` ;
}
//검색할때마다 동작하는 함수
const myquery: SearchBoxProps['queryHook'] = (query, search) => {
  console.log('search start')
  init_dict()
  search(query);
};

const HitView = (props: any) => { //검색 결과가 HitView 내용을 반복문 돌며 수행함 
  let key = props.hit.snapped_at.split('T')[0]; // 날짜 데이터 중간에 T 들어가 있어서 그걸로 분리함
  let o_id = props.hit.objectID;
  //console.log(props)
  console.log(date_set,object_set);
  if(object_set.has(o_id)){ // 두번씩 reqeust가 날라가서 초기화용
    init_dict();
  }
  else{
    object_set.add(o_id);
  }
  if(date_set.has(key)){
    return (
      <div className="hit__details">
        <h2>
          <Highlight attribute="caption" hit={props.hit} />
        </h2>
        <p> {props.hit.signed_url} </p>
        <p> {props.hit.snapped_at} </p>
      <Snippet attribute="class_list" hit={props.hit} />
      </div>
    )
  }
  else{
    date_set.add(key);
    return (
      <>
      <div className="hit__details">
        <h1> {key} </h1>
        <h2>
          <Highlight attribute="caption" hit={props.hit} />
        </h2>
        <p> {props.hit.signed_url} </p>
        <p> {props.hit.snapped_at} </p>
      <Snippet attribute="class_list" hit={props.hit} />
      </div>
      </>
    )
  }
};

export default function Web() {
  return (
    <div className="" >
      <InstantSearch indexName="nori_ngram_photo" searchClient={searchClient} routing>
        <Configure hitsPerPage={15} filters={default_filter()} />
        <div className="container" >
          <div className="searchbox" >
            <SearchBox queryHook={myquery} onSubmit={init_dict} searchAsYouType={false}/>
          </div>
            <Hits hitComponent={HitView} />
        </div>
      </InstantSearch>
    </div>
  );
}
