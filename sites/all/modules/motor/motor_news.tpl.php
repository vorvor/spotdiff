<div class="news">
	<div class="news-image"><img src=" <?php print (string)$article->enclosure['url'][0]; ?>" width="300"></div>
<?php
print '<span class="news-pubdate">' . (string)$article->pubDate . '</span>';
print '<h2 class="news-title">' . (string)$article->title . '</h2>';
print '<p class="news-description">' . (string)$article->description . '</p>';
print '<div class="news-tags">' . (string)$article->category . '</div>';
?>
</div>