import { NextRequest, NextResponse } from 'next/server'
import API, { MatchFilter } from '@searchkit/api'

const apiClient = API(
  {
    connection: {
      host: "http://localhost:9200"
    },
    search_settings: { 
      highlight_attributes:['caption','class_list'], // 강조할 필드들 
      search_attributes: [ // 검색할 필드들 
        { field: 'caption.nori', weight: 3 },
        { field: 'class_list', weight: 2 }
      ],
      result_attributes: ['caption','signed_url','class_list','snapped_at'], // 결과로 보여줄 필드들 
      snippet_attributes:['class_list'], // list 항목 나눠서 보여주기
      facet_attributes: [
        { 
          attribute: 'class_list', // 
          field: 'class_list.keyword',  // field must be a keyword type field
          type: 'string' 
        }
      ],
      filter_attributes: [ // 필터로 쓸 필드를 요기서 선언해줘야함!
        {
          attribute: 'user_id',
          field: 'user_id',
          type: 'numeric'
        },
        {
          attribute: 'snapped_at', 
          field: 'snapped_at',  // field must be a keyword type field
          type: 'date' 
        }
      ],
      sorting:{
        default:{ // 최신 날짜 순으로
          field:'snapped_at',
          order:'desc'
        }
      }
    }
  },
  { debug: false },
  
)

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.json()
  const results = await apiClient.handleRequest(data)
  return NextResponse.json(results)
}
