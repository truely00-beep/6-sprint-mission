// ProductClasses.js

/**
 * 기본 상품 클래스 (Product)
 * 추상화: 상품의 핵심 속성과 기능을 정의합니다.
 */
export class Product {
    constructor(data) {
        // 캡슐화: private 속성으로 선언하고 getter/setter를 사용할 수도 있지만,
        // 여기서는 간단하게 public 속성으로 정의합니다.
        this.id = data.id || null;
        this.name = data.name;
        this.description = data.description;
        this.price = data.price;
        this.tags = data.tags || [];
        this.images = data.images || [];
        this.favoriteCount = data.favoriteCount || 0; // 찜하기 수 기본값
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || this.createdAt;
    }

    /**
     * 캡슐화된 찜하기 수를 1 증가시키는 메서드입니다.
     */
    favorite() {
        this.favoriteCount += 1;
        console.log(`[${this.name}] 찜하기 1 증가! (총 ${this.favoriteCount}개)`);
    }

    /**
     * 상품 정보를 깔끔하게 출력하는 메서드입니다.
     */
    displayInfo() {
        return `[상품] ${this.name} | 가격: ${this.price.toLocaleString()}원 | 찜: ${this.favoriteCount}`;
    }

    /**
     * API 요청 본문을 생성합니다.
     */
    toRequestBody() {
        return {
            name: this.name,
            description: this.description,
            price: this.price,
            tags: this.tags,
            images: this.images,
        };
    }
}

/**
 * 전자제품 클래스 (ElectronicProduct)
 * 상속: Product 클래스의 속성과 기능을 물려받습니다.
 * 다형성: displayInfo 등의 메서드를 오버라이딩하여 고유 기능을 추가할 수 있습니다.
 */
export class ElectronicProduct extends Product {
    constructor(data) {
        super(data); // 부모 클래스의 constructor 호출
        this.manufacturer = data.manufacturer || '미정'; // 추가 프로퍼티
    }

    /**
     * 다형성: ElectronicProduct에 맞는 정보를 추가하여 출력합니다.
     */
    displayInfo() {
        return `[전자제품] ${this.name} | 제조사: ${this.manufacturer} | 가격: ${this.price.toLocaleString()}원`;
    }
}