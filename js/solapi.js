// ============================================
// 솔라피 카카오톡/SMS 발송 모듈
// Supabase Edge Function을 통해 호출 (API 키 보안)
// ============================================

/**
 * 보증서 발송 (카카오톡 → 실패 시 MMS 대체)
 * @param {Object} warranty - 보증서 데이터
 * @param {string} imageUrl  - 생성된 보증서 이미지 URL
 */
async function sendWarranty(warranty, imageUrl) {
  try {
    const { data, error } = await supabaseClient.functions.invoke('send-warranty', {
      body: {
        customerPhone: warranty.customer_phone,
        customerName: warranty.customer_name,
        warrantyNumber: warranty.warranty_number,
        serviceDate: warranty.service_date,
        shopName: warranty.shop_name,
        imageUrl: imageUrl,
      }
    });

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('발송 오류:', err);
    return { success: false, error: err.message };
  }
}

// ============================================
// Supabase Edge Function 코드 (참고용)
// supabase/functions/send-warranty/index.ts 에 배포
// ============================================
/*
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { customerPhone, customerName, warrantyNumber, serviceDate, shopName, imageUrl } = await req.json()

  const SOLAPI_API_KEY = Deno.env.get('SOLAPI_API_KEY')
  const SOLAPI_API_SECRET = Deno.env.get('SOLAPI_API_SECRET')
  const SENDER_PHONE = Deno.env.get('SENDER_PHONE')

  // 솔라피 메시지 발송 API
  const message = {
    to: customerPhone,
    from: SENDER_PHONE,
    type: 'MMS',                          // 카카오 채널 설정 시 AT(알림톡)으로 변경
    subject: 'THE SMITH 보증서',
    text: `[THE SMITH] ${customerName}님의 보증서가 등록되었습니다.\n보증번호: ${warrantyNumber}\n시공일자: ${serviceDate}\n시공점: ${shopName}\n\n보증서 이미지를 확인해 주세요.`,
    imageUrl: imageUrl,
  }

  // ... 솔라피 API 호출 로직
})
*/
