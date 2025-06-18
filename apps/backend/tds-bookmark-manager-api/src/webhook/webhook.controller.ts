import { Controller, Post, UseGuards, Query, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { User } from '../auth/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { CreateBookmarkDto } from '@tds/tds-bm-common';

@Controller('webhook')
export class WebhookController {
    constructor(private readonly bookmarksService: BookmarksService) {}

    @Post('bookmark')
    @UseGuards(AuthGuard('api-key'))
    addBookmarkFromWebhook(
        @User() user: UserEntity,
        @Query(new ValidationPipe({ transform: true })) query: CreateBookmarkDto,
    ) {
        // The user object is injected after being validated by ApiKeyStrategy
        // The query object contains the 'url' and optional 'title'
        return this.bookmarksService.create(query, user);
    }
}